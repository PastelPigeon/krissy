// src/hooks/useTmpDownload.ts
import { useEffect, useState } from 'react';
import { tempDir } from '@tauri-apps/api/path';
import { writeFile, remove } from '@tauri-apps/plugin-fs';
import { fetch } from '@tauri-apps/plugin-http';

interface TmpFile {
  path: string;
  isDownloading: boolean;
  hasError: boolean;
  error?: string;
  url?: string;
}

interface DownloadResult {
  path: string;
  success: boolean;
  error?: string;
}

const useTmpDownload = () => {
  const [downloads, setDownloads] = useState<Record<string, TmpFile>>({});

  // 清理所有临时文件
  const cleanDownloads = async (): Promise<void> => {
    try {
      const paths = Object.keys(downloads);
      await Promise.all(
        paths.map(path => 
          remove(path).catch(error => {
            console.error(`Failed to remove file ${path}:`, error);
          })
        )
      );
      
      setDownloads({});
      return;
    } catch (error) {
      console.error('Clean failed:', error);
      throw error;
    }
  };

  // 下载单个文件
  const downloadFile = async (url: string): Promise<DownloadResult> => {
    const tempPath = await generateTempPath(url);
    
    // 添加新下载项
    setDownloads(prev => ({
      ...prev,
      [tempPath]: {
        path: tempPath,
        isDownloading: true,
        hasError: false,
        url
      }
    }));

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      const data = new Uint8Array(buffer);
      
      await writeFile(tempPath, data);
      
      // 更新下载状态
      setDownloads(prev => ({
        ...prev,
        [tempPath]: {
          ...prev[tempPath],
          isDownloading: false,
          hasError: false
        }
      }));
      
      return { path: tempPath, success: true };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Download failed for ${url}:`, errorMsg);
      
      setDownloads(prev => ({
        ...prev,
        [tempPath]: {
          ...prev[tempPath],
          isDownloading: false,
          hasError: true,
          error: errorMsg
        }
      }));
      
      return { 
        path: tempPath, 
        success: false, 
        error: errorMsg 
      };
    }
  };

  // 批量下载 - 返回所有文件下载结果
  const downloadTmpFiles = async (urls: string[]): Promise<DownloadResult[]> => {
    return Promise.all(urls.map(url => downloadFile(url)));
  };

  // 生成唯一临时路径
  const generateTempPath = async (url: string): Promise<string> => {
    const ext = getFileExtension(url);
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const tempDirPath = await tempDir();
    
    return `${tempDirPath}/tmpfile_${timestamp}_${random}.${ext}`;
  };

  // 从URL中提取文件扩展名
  const getFileExtension = (url: string): string => {
    try {
      const parsed = new URL(url);
      const pathParts = parsed.pathname.split('/');
      const filename = pathParts[pathParts.length - 1];
      const dotIndex = filename.lastIndexOf('.');
      
      if (dotIndex !== -1) {
        return filename.substring(dotIndex + 1).split('?')[0];
      }
    } catch (e) {
      console.warn('Failed to parse URL:', url);
    }
    return 'tmp';
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      // 注意：在卸载时清理可能中断正在进行的下载
      cleanDownloads().catch(console.error);
    };
  }, []);

  // 将下载对象转换为数组便于渲染
  const downloadsArray = Object.values(downloads);

  return {
    downloads: downloadsArray,
    downloadTmpFiles,
    cleanDownloads
  };
};

export default useTmpDownload;