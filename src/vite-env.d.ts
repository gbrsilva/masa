/// <reference types="vite/client" />

interface Window {
  __TAURI__: {
    window: any;
    [key: string]: any;
  }
}
