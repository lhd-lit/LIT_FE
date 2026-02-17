/**
 * Preload Script
 * 카카오 기술 블로그 방식 참고: https://tech.kakao.com/posts/453
 * 
 * 렌더러 프로세스에 안전하게 Electron API 노출
 * contextIsolation이 활성화된 상태에서 사용
 */

import { contextBridge, ipcRenderer } from 'electron';

// Electron API를 window 객체에 노출
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * 시스템 기본 브라우저에서 URL 열기
   * OAuth 로그인 시 사용
   */
  openExternal: (url: string): Promise<boolean> => {
    return ipcRenderer.invoke('open-external', url);
  },

  /**
   * 플랫폼 정보
   */
  platform: process.platform,
});
