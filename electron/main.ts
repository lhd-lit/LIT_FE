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

function resolveAppIcon(): string | undefined {
  if (app.isPackaged) {
    const ico = join(process.resourcesPath, "appLogo.ico");
    if (existsSync(ico)) return ico;
    const png = join(process.resourcesPath, "appLogo.png");
    if (existsSync(png)) return png;
    return undefined;
  }
  const devIco = join(__dirname, "../public/appLogo.ico");
  if (existsSync(devIco)) return devIco;
  const devPng = join(__dirname, "../public/appLogo.png");
  if (existsSync(devPng)) return devPng;
  return undefined;
}

/**
 * 메인 윈도우 생성
 */
const createWindow = () => {
  // preload 스크립트 경로 설정
  // __dirname은 dist-electron 폴더를 가리킴 (개발/프로덕션 모두)
  // dist-electron/package.json(type: commonjs)로 .js 출력이 CJS로 실행됨
  const preloadPath = join(__dirname, "preload.js");
  
  // preload 파일 존재 확인
  if (!existsSync(preloadPath)) {
    console.error(`Preload 파일을 찾을 수 없습니다: ${preloadPath}`);
  }

  const icon = resolveAppIcon();

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    ...(icon ? { icon } : {}),
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

};

/**
 * 커스텀 프로토콜 URL 처리
 * lit://login-success?accessToken=... 형식
 */
const handleProtocolUrl = (url: string) => {
  if (!url.startsWith(`${PROTOCOL_SCHEME}://`)) {
    return;
  }

  try {
    const urlObj = new URL(url);
    // lit://login-success/?accessToken=... 형식에서 login-success는 hostname입니다
    const hostname = urlObj.hostname;
    const path = urlObj.pathname;
    const fullPath = hostname + path; // "login-success" + "/"
    const token = urlObj.searchParams.get('accessToken') || urlObj.searchParams.get('token');

    // hostname 또는 fullPath에서 login-success 확인
    const isLoginSuccess = hostname.includes('login-success') || fullPath.includes('login-success') || path.includes('login-success');

    if (isLoginSuccess && token) {
      // 메인 윈도우가 없으면 생성
      if (!mainWindow) {
        createWindow();
        // 윈도우 로드 대기 후 토큰 전달
        setTimeout(() => {
          if (mainWindow) {
            navigateToLoginSuccess(token);
          }
        }, 1000);
      } else {
        navigateToLoginSuccess(token);
      }
    }
  } catch (error) {
    console.error('URL 처리 실패:', error);
  }
};

/**
 * 로그인 성공 페이지로 이동
 */
const navigateToLoginSuccess = (token: string) => {
  if (!mainWindow) {
    return;
  }

  try {
    if (isDev) {
      const targetUrl = `http://localhost:5173/#/login-success?accessToken=${encodeURIComponent(token)}`;
      mainWindow.loadURL(targetUrl);
    } else {
      // 프로덕션 모드: 해시 변경
      mainWindow.webContents.executeJavaScript(
        `window.location.hash = '#/login-success?accessToken=${encodeURIComponent(token)}';`
      );
    }
    
    mainWindow.focus();
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
  } catch (error) {
    console.error('로그인 성공 페이지 이동 실패:', error);
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
    console.error('외부 URL 열기 실패:', error);
    return false;
  }
});

/**
 * 앱 초기화
 */
app.whenReady().then(() => {
  // 커스텀 프로토콜 등록 (Windows/Linux)
  if (process.platform === 'win32' || process.platform === 'linux') {
    if (!app.isDefaultProtocolClient(PROTOCOL_SCHEME)) {
      app.setAsDefaultProtocolClient(PROTOCOL_SCHEME);
    }
  }

  // macOS: open-url 이벤트
  app.on('open-url', (event, url) => {
    event.preventDefault();
    handleProtocolUrl(url);
  });

  // Windows/Linux: 명령줄 인자
  if (process.platform === 'win32' || process.platform === 'linux') {
    const url = process.argv.find(arg => arg.startsWith(`${PROTOCOL_SCHEME}://`));
    if (url) {
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
  app.on('second-instance', (_event, commandLine) => {
    const url = commandLine.find(arg => arg.startsWith(`${PROTOCOL_SCHEME}://`));
    if (url) {
      handleProtocolUrl(url);
    }
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // 단일 인스턴스 앱으로 설정
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
