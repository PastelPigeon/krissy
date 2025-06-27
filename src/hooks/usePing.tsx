// src/hooks/usePing.ts
import { fetch } from '@tauri-apps/plugin-http';
import { useState } from 'react';

// 定义状态对象的类型
interface PingResult {
  url: string;
  loading: boolean;
  RTT: string; // 延迟时间（字符串形式）
}

const usePing = () => {
  // 状态管理，存储所有URL的ping结果
  const [urlRTTs, setUrlRTTs] = useState<PingResult[]>([]);

  // 获取指定URL的延迟
  const getRTT = async (url: string) => {
    // 检查是否已存在记录
    const existingIndex = urlRTTs.findIndex(item => item.url === url);
    
    // 更新状态：设置目标URL为加载中
    setUrlRTTs(prev => {
      if (existingIndex >= 0) {
        const newState = [...prev];
        newState[existingIndex] = { ...newState[existingIndex], loading: true };
        return newState;
      }
      return [...prev, { url, loading: true, RTT: '' }];
    });

    try {
      // 调用API获取延迟数据
      const response = await fetch(`https://api.mmp.cc/api/ping?text=${encodeURIComponent(url)}`, {method: "GET"});
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 提取延迟数据（假设API返回格式为 { data: { 延迟: number } }）
      const latency = data.data?.延迟 ?? 'N/A';
      
      // 更新状态：设置延迟结果
      setUrlRTTs(prev => {
        const newState = [...prev];
        const targetIndex = newState.findIndex(item => item.url === url);
        
        if (targetIndex >= 0) {
          newState[targetIndex] = {
            url,
            loading: false,
            RTT: typeof latency === 'number' ? `${latency}ms` : latency
          };
        }
        return newState;
      });
    } catch (error) {
      console.error('Ping error:', error);
      
      // 更新状态：设置错误状态
      setUrlRTTs(prev => {
        const newState = [...prev];
        const targetIndex = newState.findIndex(item => item.url === url);
        
        if (targetIndex >= 0) {
          newState[targetIndex] = {
            url,
            loading: false,
            RTT: 'Error'
          };
        }
        return newState;
      });
    }
  };

  return {
    urlRTTs,  // 当前所有URL的ping状态
    getRTT    // 触发获取延迟的方法
  };
};

export default usePing;