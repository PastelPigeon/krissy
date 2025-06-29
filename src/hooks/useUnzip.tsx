// src/hooks/useUnzip.ts
import { useState, useCallback } from 'react';
import { Command } from '@tauri-apps/plugin-shell';
import { tempDir, join } from '@tauri-apps/api/path';
import { mkdir, remove, writeTextFile, exists, readDir } from '@tauri-apps/plugin-fs';

interface UnzipItem {
  id: string;
  path: string;
  hasUnzipped: boolean;
  hasError: boolean;
  tempDir?: string;
  error?: string;
}

interface UseUnzipResult {
  unzip: (zipFiles: string[]) => Promise<UnzipItem[]>;
  cleanZips: () => Promise<void>;
  zips: UnzipItem[];
  isUnzipping: boolean;
}

const useUnzip = (): UseUnzipResult => {
  const [zips, setZips] = useState<UnzipItem[]>([]);
  const [isUnzipping, setIsUnzipping] = useState(false);

  const unzip = useCallback(async (zipFiles: string[]): Promise<UnzipItem[]> => {
    setIsUnzipping(true);
    
    // 创建带唯一ID的初始状态项
    const newItems: UnzipItem[] = zipFiles.map(path => ({
      id: `unzip_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      path,
      hasUnzipped: false,
      hasError: false
    }));
    
    // 添加到状态
    setZips(prev => [...prev, ...newItems]);
    
    try {
      const baseTempDir = await tempDir();
      const sevenZipPath = "externals/7zip/7z";
      
      // 使用Promise.allSettled处理所有解压任务
      const results = await Promise.allSettled(
        newItems.map(async (item) => {
          const logEntries: string[] = [];
          
          try {
            // 创建唯一临时目录
            const uniqueDir = await join(baseTempDir, item.id);
            await mkdir(uniqueDir, { recursive: true });
            
            // 验证源文件存在
            if (!(await exists(item.path))) {
              throw new Error(`Source file not found: ${item.path}`);
            }
            
            // 创建日志文件路径
            const logPath = await join(baseTempDir, `${item.id}.log`);
            
            // 记录命令信息
            logEntries.push(
              `[${new Date().toISOString()}] Starting 7z extraction`,
              `Command: 7z x -o${uniqueDir} ${item.path} -y`,
              `Working directory: ${uniqueDir}`,
              `7z executable: ${sevenZipPath}`
            );
            
            // 构造解压命令
            const command = Command.sidecar(sevenZipPath, [
              'x',
              `-o${uniqueDir}`,
              item.path,
              '-y'
            ], { 
              encoding: "utf8",
              cwd: uniqueDir  // 设置工作目录为临时目录
            });
            
            // 捕获命令输出
            let commandOutput = '';
            command.stdout.on('data', (data) => {
              commandOutput += data;
            });
            command.stderr.on('data', (data) => {
              commandOutput += data;
            });
            
            // 执行命令
            const { code } = await command.execute();
            
            logEntries.push(`Exit code: ${code}`);
            logEntries.push(`Output: ${commandOutput}`);
            
            // 检查退出代码
            if (code !== 0) {
              throw new Error(`7z exited with code ${code}`);
            }
            
            // 验证解压结果
            const dirExists = await exists(uniqueDir);
            if (!dirExists) {
              throw new Error(`Extraction directory not created: ${uniqueDir}`);
            }
            
            const files = await readDir(uniqueDir);
            if (files.length === 0) {
              throw new Error(`Extraction completed but directory is empty: ${uniqueDir}`);
            }
            
            // 写入日志文件
            await writeTextFile(logPath, logEntries.join('\n'));
            
            // 更新状态
            setZips(prev => prev.map(z => 
              z.id === item.id 
                ? { ...z, hasUnzipped: true, tempDir: uniqueDir } 
                : z
            ));
            
            return { 
              ...item, 
              hasUnzipped: true,
              tempDir: uniqueDir
            };
          } catch (error) {
            // 错误处理
            const errorMsg = error instanceof Error ? error.message : String(error);
            logEntries.push(`ERROR: ${errorMsg}`);
            
            // 尝试保存错误日志
            try {
              if (item.id) {
                const logPath = await join(baseTempDir, `${item.id}_error.log`);
                await writeTextFile(logPath, logEntries.join('\n'));
              }
            } catch (logError) {
              console.error('Failed to write error log:', logError);
            }
            
            // 更新状态
            setZips(prev => prev.map(z => 
              z.id === item.id 
                ? { ...z, hasError: true, error: errorMsg } 
                : z
            ));
            
            return { 
              ...item, 
              hasError: true,
              error: errorMsg
            };
          }
        })
      );
      
      // 返回所有解压结果
      return results.map(result => 
        result.status === 'fulfilled' ? result.value : {
          id: `error_${Date.now()}`,
          path: '',
          hasUnzipped: false,
          hasError: true,
          error: result.reason?.message || 'Unknown error'
        }
      );
    } catch (error) {
      console.error('Unzip operation failed:', error);
      return newItems.map(item => ({
        ...item,
        hasError: true,
        error: error instanceof Error ? error.message : String(error)
      }));
    } finally {
      setIsUnzipping(false);
    }
  }, []);

  const cleanZips = useCallback(async (): Promise<void> => {
    try {
      // 收集所有需要清理的临时目录
      const dirsToRemove = zips
        .filter(item => item.tempDir)
        .map(item => item.tempDir) as string[];
      
      // 并行删除所有目录
      await Promise.all(
        dirsToRemove.map(dir => remove(dir, { recursive: true }))
      );
      
      // 重置状态
      setZips([]);
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  }, [zips]);

  return { unzip, cleanZips, zips, isUnzipping };
};

export default useUnzip;