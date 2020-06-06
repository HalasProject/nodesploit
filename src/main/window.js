import {BrowserWindow} from 'electron'

export function mainWindow (){
  const winURL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:9080`
      : `file://${__dirname}/index.html`;

  let window = new BrowserWindow({
    height: 563,
    width: 1000,
    frame: false,
    movable:true,
    useContentSize: true,
    webPreferences:{
        nodeIntegration:true
    }
  });

  window.loadURL(winURL);

  
  return window;
};