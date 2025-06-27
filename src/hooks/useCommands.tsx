// src/hooks/useCommands.ts
import { useState, useCallback } from 'react';
import { Command } from '@tauri-apps/plugin-shell';

// 命令状态类型
export interface CommandStatus {
  command: string;
  running: boolean;
  hasError: boolean;
}

// Hook 返回类型
interface UseCommands {
  commands: CommandStatus[];
  runCommands: (commands: string[]) => Promise<void>;
  killCommands: () => Promise<void>;
}

export function useCommands(): UseCommands {
  const [commands, setCommands] = useState<CommandStatus[]>([]);
  const [processes, setProcesses] = useState<Command<string>[]>([]);

  // 执行命令数组
  const runCommands = useCallback(async (commandsToRun: string[]) => {
    // 初始化命令状态
    const initialStatus: CommandStatus[] = commandsToRun.map(command => ({
      command,
      running: false,
      hasError: false
    }));
    
    setCommands(initialStatus);
    const newProcesses: Command<string>[] = [];
    const processPromises: Promise<void>[] = [];

    for (let i = 0; i < commandsToRun.length; i++) {
      const commandStr = commandsToRun[i];
      try {
        // 创建命令实例
        const cmd = Command.create("run-command", commandStr.split(" "));
        newProcesses.push(cmd);
        
        // 更新状态为运行中
        setCommands(prev => prev.map((item, idx) => 
          idx === i ? { ...item, running: true } : item
        ));
        
        // 执行命令并处理结果
        const processPromise = cmd.execute().then(() => {
          // 命令成功完成
          setCommands(prev => prev.map((item, idx) => 
            idx === i ? { ...item, running: false } : item
          ));
        }).catch(() => {
          // 命令执行失败
          setCommands(prev => prev.map((item, idx) => 
            idx === i ? { ...item, running: false, hasError: true } : item
          ));
        });
        
        processPromises.push(processPromise);
      } catch (error) {
        // 命令创建失败
        setCommands(prev => prev.map((item, idx) => 
          idx === i ? { ...item, running: false, hasError: true } : item
        ));
      }
    }
    
    setProcesses(newProcesses);
    
    try {
      // 等待所有命令执行完成
      await Promise.all(processPromises);
    } finally {
      // 清除已完成进程
      setProcesses([]);
    }
  }, []);

  // 终止所有正在运行的命令
  const killCommands = useCallback(async () => {
    const killPromises = processes.map(proc => 
      proc.spawn().then((child) => child.kill())
    );

    // 更新所有正在运行的命令状态为出错
    setCommands(prev => prev.map(item => 
      item.running ? { ...item, running: false, hasError: true } : item
    ));
    
    await Promise.all(killPromises);
    setProcesses([]);
  }, [processes]);

  return {
    commands,
    runCommands,
    killCommands
  };
}