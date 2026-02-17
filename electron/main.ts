/**
 * Electron Main Process
 * 카카오 기술 블로그 방식 참고: https://tech.kakao.com/posts/453
 * 
 * 핵심 플로우:
 * 1. 시스템 브라우저에서 OAuth 로그인 진행
 * 2. 커스텀 프로토콜(lit://)로 리다이렉트
 * 3. Electron 앱이 프로토콜을 받아서 처리
 */

import { app, BrowserWindow, shell, ipcMain } from "electron";
import { join } from "path";
import { existsSync } from "fs";

// CommonJS로 컴파일되므로 __dirname이 자동으로 제공됨
// TypeScript 컴파일러가 인식하지 못하므로 명시적으로 선언
declare const __dirname: string;

// 커스텀 프로토콜 스킴
const PROTOCOL_SCHEME = 'lit';

// 개발 모드 확인
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

// 메인 윈도우 참조
let mainWindow: BrowserWindow | null = null;

/**
 * 메인 윈도우 생성
 */
const createWindow = () => {
  // preload 스크립트 경로 설정
  // __dirname은 dist-electron 폴더를 가리킴 (개발/프로덕션 모두)
  // CommonJS로 컴파일되므로 .cjs 확장자 사용
  const preloadPath = join(__dirname, "preload.cjs");
  
  // preload 파일 존재 확인
  if (!existsSync(preloadPath)) {
    console.error(`[Preload] 파일을 찾을 수 없습니다: ${preloadPath}`);
    console.error(`[Preload] __dirname: ${__dirname}`);
  } else {
    console.log(`[Preload] 파일 로드 성공: ${preloadPath}`);
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // app.asar 내부 파일 로드를 위해
      preload: preloadPath,
    },
  });

  mainWindow = win;

  // window.open() 호출 차단 (모든 외부 링크는 IPC를 통해 처리)
  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // 개발 모드: Vite dev server
  // 프로덕션 모드: 빌드된 파일
  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, "../dist/index.html"));
  }

  // preload 로드 확인
  win.webContents.once('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      console.log('[Electron] electronAPI 사용 가능:', typeof window.electronAPI !== 'undefined');
      if (window.electronAPI) {
        console.log('[Electron] openExternal 사용 가능:', typeof window.electronAPI.openExternal === 'function');
      }
    `).catch(console.error);
  });
};

/**
 * 커스텀 프로토콜 URL 처리
 * lit://login-success?accessToken=... 형식
 */
const handleProtocolUrl = (url: string) => {
  // 메인 프로세스 로그
  console.log(`[Protocol] URL 수신: ${url}`);
  
  // 렌더러 프로세스에도 로그 전달 (가능한 경우)
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.executeJavaScript(`
      console.log('[Protocol] lit:// 프로토콜 URL 수신:', '${url}');
    `).catch(() => {
      // 렌더러가 아직 준비되지 않았을 수 있음
    });
  }

  if (!url.startsWith(`${PROTOCOL_SCHEME}://`)) {
    console.warn(`[Protocol] 잘못된 프로토콜: ${url}`);
    return;
  }

  try {
    const urlObj = new URL(url);
    // lit://login-success/?accessToken=... 형식에서 login-success는 hostname입니다
    const hostname = urlObj.hostname;
    const path = urlObj.pathname;
    const fullPath = hostname + path; // "login-success" + "/"
    const token = urlObj.searchParams.get('accessToken') || urlObj.searchParams.get('token');

    console.log(`[Protocol] hostname: ${hostname}, path: ${path}, fullPath: ${fullPath}, 토큰 존재: ${!!token}, 토큰 길이: ${token?.length || 0}`);
    
    // 렌더러에도 로그 전달
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.executeJavaScript(`
        console.log('[Protocol] 경로 파싱:', 'hostname=${hostname}', 'path=${path}', 'fullPath=${fullPath}', '토큰 존재:', ${!!token});
      `).catch(() => {});
    }

    // hostname 또는 fullPath에서 login-success 확인
    const isLoginSuccess = hostname.includes('login-success') || fullPath.includes('login-success') || path.includes('login-success');
    console.log(`[Protocol] 로그인 성공 경로 체크: ${isLoginSuccess}, hostname.includes('login-success'): ${hostname.includes('login-success')}, fullPath.includes('login-success'): ${fullPath.includes('login-success')}`);

    if (isLoginSuccess && token) {
      console.log('[Protocol] 로그인 성공 처리 시작');
      
      // 렌더러에도 로그 전달
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.executeJavaScript(`
          console.log('[Protocol] 로그인 성공 처리 시작');
        `).catch(() => {});
      }
      
      // 메인 윈도우가 없으면 생성
      if (!mainWindow || mainWindow.isDestroyed()) {
        console.log('[Protocol] 메인 윈도우가 없어서 생성 중...');
        createWindow();
        // 윈도우 로드 대기 후 토큰 전달
        mainWindow?.webContents.once('did-finish-load', () => {
          console.log('[Protocol] 윈도우 로드 완료, 로그인 성공 페이지로 이동');
          if (mainWindow && !mainWindow.isDestroyed()) {
            // 약간의 지연을 두고 네비게이션 (렌더러 프로세스 준비 대기)
            setTimeout(() => {
              console.log('[Protocol] navigateToLoginSuccess 호출');
              navigateToLoginSuccess(token);
            }, 100);
          }
        });
      } else {
        console.log('[Protocol] 기존 윈도우 사용, 로그인 성공 페이지로 이동');
        console.log('[Protocol] navigateToLoginSuccess 즉시 호출');
        // 윈도우가 이미 로드되어 있으면 즉시 네비게이션
        navigateToLoginSuccess(token);
      }
    } else {
      console.warn(`[Protocol] 잘못된 경로 또는 토큰 없음: path=${path}, token=${!!token}, isLoginSuccess=${isLoginSuccess}`);
      // 렌더러에도 경고 전달
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.executeJavaScript(`
          console.warn('[Protocol] 잘못된 경로 또는 토큰 없음:', '${path}', ${!!token});
        `).catch(() => {});
      }
    }
  } catch (error) {
    console.error('[Protocol] URL 처리 실패:', error);
    // 렌더러에도 에러 전달
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.executeJavaScript(`
        console.error('[Protocol] URL 처리 실패:', '${error}');
      `).catch(() => {});
    }
  }
};

/**
 * 로그인 성공 페이지로 이동
 */
const navigateToLoginSuccess = (token: string) => {
  console.log('[Navigation] navigateToLoginSuccess 함수 시작');
  console.log('[Navigation] isDev:', isDev);
  console.log('[Navigation] mainWindow 존재:', !!mainWindow);
  console.log('[Navigation] mainWindow 파괴됨:', mainWindow?.isDestroyed());
  
  if (!mainWindow || mainWindow.isDestroyed()) {
    console.error('[Navigation] 메인 윈도우가 없거나 파괴됨');
    return;
  }

  try {
    const targetHash = `#/login-success?accessToken=${encodeURIComponent(token)}`;
    console.log('[Navigation] targetHash:', targetHash);
    
    if (isDev) {
      const targetUrl = `http://localhost:5173${targetHash}`;
      console.log('[Navigation] 개발 모드 - URL 로드:', targetUrl);
      mainWindow.loadURL(targetUrl);
    } else {
      // 프로덕션 모드: 해시만 변경 (페이지 리로드 없이)
      console.log('[Navigation] 프로덕션 모드 - 해시 변경 시도:', targetHash);
      // 렌더러 프로세스에 로그 전달 및 해시 변경
      mainWindow.webContents.executeJavaScript(`
        console.log('[Navigation] 해시 변경 실행:', '${targetHash}');
        const currentHash = window.location.hash;
        console.log('[Navigation] 현재 해시:', currentHash);
        window.location.hash = '${targetHash}';
        console.log('[Navigation] 해시 변경 완료, 새 해시:', window.location.hash);
      `).then(() => {
        console.log('[Navigation] 해시 변경 성공');
      }).catch((error) => {
        console.error('[Navigation] 해시 변경 실패:', error);
        // 실패 시 전체 URL 로드
        const indexPath = join(__dirname, "../dist/index.html");
        const targetUrl = `file://${indexPath.replace(/\\/g, '/')}${targetHash}`;
        console.log('[Navigation] 폴백: 전체 URL 로드:', targetUrl);
        mainWindow?.loadURL(targetUrl);
      });
    }
    
    // 윈도우를 최상위로 가져오기
    console.log('[Navigation] 윈도우 포커스 설정');
    mainWindow.show();
    mainWindow.focus();
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.setAlwaysOnTop(true);
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setAlwaysOnTop(false);
      }
    }, 100);
  } catch (error) {
    console.error('[Navigation] 로그인 성공 페이지 이동 실패:', error);
  }
};

/**
 * IPC 핸들러: 시스템 브라우저에서 URL 열기
 */
ipcMain.handle('open-external', async (_event, url: string) => {
  try {
    await shell.openExternal(url);
    return true;
  } catch (error) {
    console.error('[IPC] 외부 URL 열기 실패:', error);
    return false;
  }
});

/**
 * 앱 초기화
 */
app.whenReady().then(() => {
  console.log('[App] 앱 초기화 시작');
  console.log('[App] 플랫폼:', process.platform);
  console.log('[App] 개발 모드:', isDev);
  console.log('[App] 패키징됨:', app.isPackaged);

  // 커스텀 프로토콜 등록 (Windows/Linux)
  if (process.platform === 'win32' || process.platform === 'linux') {
    const isRegistered = app.isDefaultProtocolClient(PROTOCOL_SCHEME);
    console.log(`[Protocol] 현재 등록 상태: ${isRegistered}`);
    
    if (!isRegistered) {
      const result = app.setAsDefaultProtocolClient(PROTOCOL_SCHEME);
      console.log(`[Protocol] 등록 시도 결과: ${result}`);
    } else {
      console.log(`[Protocol] 이미 등록됨: ${PROTOCOL_SCHEME}`);
    }
  }

  // macOS: open-url 이벤트
  app.on('open-url', (event, url) => {
    event.preventDefault();
    console.log('[App] macOS open-url 이벤트 수신:', url);
    handleProtocolUrl(url);
  });

  // Windows/Linux: 명령줄 인자 (앱 시작 시 프로토콜 URL이 전달된 경우)
  if (process.platform === 'win32' || process.platform === 'linux') {
    console.log('[App] 명령줄 인자:', process.argv);
    const url = process.argv.find(arg => arg.startsWith(`${PROTOCOL_SCHEME}://`));
    if (url) {
      console.log('[App] 명령줄에서 프로토콜 URL 발견:', url);
      handleProtocolUrl(url);
    }
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Windows: 두 번째 인스턴스 처리
if (process.platform === 'win32') {
  // 단일 인스턴스 앱으로 설정
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    console.log('[App] 이미 실행 중인 인스턴스가 있음, 종료');
    app.quit();
  } else {
    app.on('second-instance', (_event, commandLine) => {
      console.log('[App] 두 번째 인스턴스 감지, 명령줄:', commandLine);
      const url = commandLine.find(arg => arg.startsWith(`${PROTOCOL_SCHEME}://`));
      if (url) {
        console.log('[App] 두 번째 인스턴스에서 프로토콜 URL 발견:', url);
        handleProtocolUrl(url);
      }
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        mainWindow.show();
      }
    });
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
