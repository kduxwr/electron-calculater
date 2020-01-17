const { app, BrowserWindow, ipcMain } = require('electron');
let win;
let state, result, current, operator;

function createWindow() {
  // ブラウザウィンドウを作成
  win = new BrowserWindow({
    width: 227,
    height: 300,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // ウィンドウ最大化
  // win.setSimpleFullScreen(true)

  // デベロッパーツール自動起動
  win.webContents.openDevTools();

  //index.htmlをロード
  win.loadURL(`file://${__dirname}/index.html`);

  //ウィンドウが閉じられると発生
  win.on('closed', () => {
    win = null
  });

  result = 0;
  current = '0';
  pre_current = '0';
  operator = '';
  state = 0;

}

ipcMain.on('num', (event, arg) => {
  if (state == 0) {
    if (current == '0') {
      if (arg != '0') {
        current = arg;
      }
    } else {
      current += arg;
    }
    result = Number(current);
    event.reply('render', current);
  }
  else if (state == 1) {
    current = '0';
    state = 2;
    if (current == '0') {
      if (arg != '0') {
        current = arg;
      }
    } else {
      current += arg;
    }
    event.reply('render', current);
  }
  else if (state == 2) {
    if (current == '0') {
      if (arg != '0') {
        current = arg;
      }
    } else {
      current += arg;
    }
    event.reply('render', current);
  }
  else if (state == 3) {
    state = 0;
    if (current == '0') {
      if (arg != '0') {
        current = arg;
      }
    } else {
      current += arg;
    }
    result = Number(current);
    event.reply('render', current);
  }
});

ipcMain.on('ope', (event, arg) => {
  switch (arg) {
    case '＋':
      operator = arg;
      state = 1;
      break;
    case '−':
      operator = arg;
      state = 1;
      break;
    case '×':
      operator = arg;
      state = 1;
      break;
    case '÷':
      operator = arg;
      state = 1;
      break;
    case '＝':
      if (state == 2) {
        switch (operator) {
          case '＋':
            result += Number(current);
            break;
          case '−':
            result -= Number(current);
            break;
          case '×':
            result *= Number(current);
            break;
          case '÷':
            result /= Number(current);
            break;
        }
        state = 3;
        pre_current = current;
        current = '0';
        event.reply('render', result);
      } else if (state == 3) {
        switch (operator) {
          case '＋':
            result += Number(pre_current);
            break;
          case '−':
            result -= Number(pre_current);
            break;
          case '×':
            result *= Number(pre_current);
            break;
          case '÷':
            result /= Number(pre_current);
            break;
        }
        event.reply('render', result);
      }
      break;
  }
});

ipcMain.on('con', (event, arg) => {
  switch (arg) {
    case 'C':
      state = 0;
      current = '0';
      result = 0;
      event.reply('render', current);
      break;
  }
});

//Electronが初期化&ブラウザウィンドウを作成する関数を呼ぶ
app.on('ready', createWindow);

//ウィンドウが閉じられると終了
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

