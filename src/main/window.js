import { BrowserWindow } from "electron";

export function mainWindow() {
  const winURL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:9080`
      : `file://${__dirname}/index.html`;

  let window = new BrowserWindow({
    height: 563,
    width: 1000,
    show:false,
    frame: false,
    movable: true,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.loadURL(winURL);

  return window;
}

export function loadingWindow() {
  const winU =`loading.html`;

  let window = new BrowserWindow({
    minWidth: 500,
    closable: false,
    hasShadow: true,
    fullscreenable: false,
    webPreferences:{
      nodeIntegration:false,
      devTools:false
    },
    autoHideMenuBar: true,
    movable: false,
    maximizable: false,
    minimizable: false,
    resizable: false,
    minHeight: 500,
    width: 1000,
    height: 700,
    frame: false,
    transparent: true,
    show: true,
    center: true,
  });
  window.loadFile(winU);
  return window;
}
