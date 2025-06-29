// src/hooks/useCommands.ts
import { useState, useCallback, useRef } from 'react';
import { Command } from '@tauri-apps/plugin-shell';
import { tempDir, join } from '@tauri-apps/api/path';
import { writeTextFile, exists, mkdir, readTextFile } from '@tauri-apps/plugin-fs';

// 命令状态类型
export interface CommandStatus {
  id: string;
  command: string;
  running: boolean;
  hasError: boolean;
  logPath: string;
  exitCode?: number | null; // 改为可选属性
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

// Hook 返回类型
interface UseCommands {
  commands: CommandStatus[];
  runCommands: (commands: string[]) => Promise<CommandStatus[]>;
  killCommands: () => Promise<void>;
  clearCommands: () => void;
}

export function useCommands(): UseCommands {
  const [commands, setCommands] = useState<CommandStatus[]>([]);
  const processesRef = useRef<{ [id: string]: Command<string> }>({});
  const commandsRef = useRef<CommandStatus[]>([]);
  const logsDirRef = useRef<string>('');

  // 初始化日志目录
  const initLogsDir = useCallback(async () => {
    if (!logsDirRef.current) {
      const baseTempDir = await tempDir();
      logsDirRef.current = await join(baseTempDir, 'command_logs');
      
      // 确保日志目录存在
      if (!(await exists(logsDirRef.current))) {
        await mkdir(logsDirRef.current, { recursive: true });
      }
    }
    return logsDirRef.current;
  }, []);

  // 创建日志文件
  const createLogFile = useCallback(async (id: string) => {
    const logsDir = await initLogsDir();
    const logPath = await join(logsDir, `${id}.log`);
    
    // 创建初始日志文件
    await writeTextFile(logPath, `[${new Date().toLocaleString()}] 命令日志开始\n\n`);
    
    return logPath;
  }, [initLogsDir]);

  // 追加日志到文件
  const appendLog = useCallback(async (logPath: string, message: string) => {
    try {
      await writeTextFile(logPath, (await readTextFile(logPath)).toString() + `[${new Date().toLocaleTimeString()}] ${message}\n`);
    } catch (error) {
      console.error('日志写入失败:', error);
    }
  }, []);

  // 执行命令数组
  const runCommands = useCallback(async (commandsToRun: string[]): Promise<CommandStatus[]> => {
    // 生成唯一ID
    const generateId = () => `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    // 初始化日志目录
    await initLogsDir();
    
    // 初始化命令状态
    const initialStatus: CommandStatus[] = await Promise.all(
      commandsToRun.map(async (command) => {
        const id = generateId();
        const logPath = await createLogFile(id);
        
        return {
          id,
          command,
          running: false,
          hasError: false,
          logPath,
          startTime: new Date()
        };
      })
    );
    
    setCommands(initialStatus);
    commandsRef.current = initialStatus;
    processesRef.current = {};
    
    // 创建所有命令执行Promise
    const commandPromises = initialStatus.map(async (status) => {
      const { id, command, logPath } = status;
      
      try {
        // 记录开始信息
        await appendLog(logPath, `开始执行命令: ${command}`);
        
        // 创建命令实例
        const cmd = Command.create("run-command", command.split(" "), { encoding: "utf8" });
        processesRef.current[id] = cmd;
        
        // 更新状态为运行中
        setCommands(prev => 
          prev.map(item => 
            item.id === id ? { ...item, running: true } : item
          )
        );
        
        // 捕获命令输出并记录到文件
        cmd.stdout.on('data', async (data) => {
          await appendLog(logPath, `输出: ${data.trim()}`);
        });
        
        cmd.stderr.on('data', async (data) => {
          await appendLog(logPath, `错误: ${data.trim()}`);
        });
        
        // 执行命令
        const { code } = await cmd.execute();
        
        // 记录完成信息
        const endTime = new Date();
        const duration = (endTime.getTime() - status.startTime!.getTime()) / 1000;
        await appendLog(logPath, `命令执行完成，退出代码: ${code}`);
        await appendLog(logPath, `执行时间: ${duration.toFixed(2)} 秒`);
        
        // 创建更新后的状态对象
        const updatedStatus: CommandStatus = { 
          ...status, 
          running: false,
          hasError: code !== 0,
          exitCode: code,
          endTime
        };
        
        // 更新状态
        setCommands(prev => 
          prev.map(item => 
            item.id === id ? updatedStatus : item
          )
        );
        
        return updatedStatus;
      } catch (error: any) {
        // 错误处理
        const errorMsg = error?.message || '未知错误';
        await appendLog(logPath, `命令执行出错: ${errorMsg}`);
        
        // 创建更新后的状态对象
        const updatedStatus: CommandStatus = { 
          ...status, 
          running: false, 
          hasError: true,
          error: errorMsg,
          endTime: new Date()
        };
        
        // 更新状态
        setCommands(prev => 
          prev.map(item => 
            item.id === id ? updatedStatus : item
          )
        );
        
        return updatedStatus;
      } finally {
        // 清理进程引用
        delete processesRef.current[id];
      }
    });
    
    try {
      // 等待所有命令执行完成
      const results = await Promise.all(commandPromises);
      return results;
    } catch (error) {
      console.error('命令执行出错:', error);
      return commandsRef.current;
    }
  }, [initLogsDir, createLogFile, appendLog]);

  // 终止所有正在运行的命令
  const killCommands = useCallback(async () => {
    const killPromises = Object.entries(processesRef.current).map(async ([id, proc]) => {
      const command = commandsRef.current.find(c => c.id === id);
      
      if (command) {
        try {
          // 记录终止信息
          await appendLog(command.logPath, '命令被终止');
          
          // 尝试获取子进程并终止
          const child = await proc.spawn();
          if (child.pid) {
            await child.kill();
          }
        } catch (error: any) {
          await appendLog(command.logPath, `终止命令失败: ${error?.message || '未知错误'}`);
        }
        
        // 更新命令状态
        const endTime = new Date();
        const duration = command.startTime 
          ? (endTime.getTime() - command.startTime.getTime()) / 1000 
          : 0;
        
        await appendLog(command.logPath, `命令被终止，执行时间: ${duration.toFixed(2)} 秒`);
        
        // 创建更新后的状态对象
        const updatedStatus: CommandStatus = {
          ...command,
          running: false,
          hasError: true,
          endTime
        };
        
        // 更新状态
        setCommands(prev => 
          prev.map(item => 
            item.id === id ? updatedStatus : item
          )
        );
      }
    });
    
    await Promise.all(killPromises);
    processesRef.current = {};
  }, [appendLog]);

  // 清除所有命令状态（保留日志文件）
  const clearCommands = useCallback(() => {
    setCommands([]);
    commandsRef.current = [];
    processesRef.current = {};
  }, []);

  return {
    commands,
    runCommands,
    killCommands,
    clearCommands
  };
}