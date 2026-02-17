interface ElectronAPI {
  openExternal: (url: string) => Promise<boolean>;
  platform: NodeJS.Platform;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};

