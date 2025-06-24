// src/hooks/useUnzip.ts
import { useState, useCallback } from 'react';
import { Command } from '@tauri-apps/plugin-shell';
import { tempDir } from '@tauri-apps/api/path';
import { mkdir, remove } from '@tauri-apps/plugin-fs';

interface UnzipItem {
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
  
  // 获取7zip路径
  const get7zipPath = useCallback(() => {
    return import.meta.env.VITE_7ZIP_PATH;
  }, []);

  const unzip = useCallback(async (zipFiles: string[]): Promise<UnzipItem[]> => {
    setIsUnzipping(true);
    
    // 创建初始状态项
    const newItems: UnzipItem[] = zipFiles.map(path => ({
      path,
      hasUnzipped: false,
      hasError: false
    }));
    
    // 添加到状态并获取引用
    setZips(prev => [...prev, ...newItems]);
    const startingIndex = zips.length;
    
    try {
      const baseTempDir = await tempDir();
      const sevenZipPath = get7zipPath();
      
      // 使用 Promise.allSettled 确保所有任务完成
      const results = await Promise.allSettled(
        zipFiles.map(async (filePath, index) => {
          const itemIndex = startingIndex + index;
          try {
            // 创建唯一临时目录
            const uniqueDir = `${baseTempDir}/unzip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            await mkdir(uniqueDir, { recursive: true });

            // 执行解压命令
            const command = Command.create(sevenZipPath, [
              'x',
              `-o${uniqueDir}`,
              filePath,
              '-y'
            ]);

            const { code } = await command.execute();
            
            if (code !== 0) throw new Error(`Exit code: ${code}`);
            
            // 更新成功状态
            setZips(prev => prev.map((item, i) => 
              i === itemIndex 
                ? { ...item, hasUnzipped: true, tempDir: uniqueDir } 
                : item
            ));
            
            return { 
              path: filePath, 
              hasUnzipped: true, 
              hasError: false,
              tempDir: uniqueDir
            };
          } catch (error) {
            console.error(`Unzip failed for ${filePath}:`, error);
            
            // 更新错误状态
            setZips(prev => prev.map((item, i) => 
              i === itemIndex 
                ? { 
                    ...item, 
                    hasError: true, 
                    error: error instanceof Error ? error.message : String(error) 
                  } 
                : item
            ));
            
            return { 
              path: filePath, 
              hasUnzipped: false, 
              hasError: true,
              error: error instanceof Error ? error.message : String(error)
            };
          }
        })
      );
      
      // 返回所有解压结果
      return results.map(result => 
        result.status === 'fulfilled' ? result.value : {
          path: '',
          hasUnzipped: false,
          hasError: true,
          error: result.reason?.message || 'Unknown error'
        }
      );
    } catch (error) {
      console.error('Unzip operation failed:', error);
      return [];
    } finally {
      setIsUnzipping(false);
    }
  }, [get7zipPath, zips.length]);

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
      throw error; // 抛出错误以便外部处理
    }
  }, [zips]);

  return { unzip, cleanZips, zips, isUnzipping };
};

export default useUnzip;