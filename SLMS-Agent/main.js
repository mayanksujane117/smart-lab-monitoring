const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {

  mainWindow = new BrowserWindow({

    width: 900,
    height: 600,

    resizable: false,

    autoHideMenuBar: true,

    icon: path.join(
      __dirname,
      "assets",
      "icon.ico"
    ),

    webPreferences: {

      preload: path.join(
        __dirname,
        "preload.js"
      ),

      contextIsolation: true,

      nodeIntegration: false

    }

  });

  const configPath =
    path.join(
      __dirname,
      "agent",
      "config.json"
    );

  let config = {};

  if (
    fs.existsSync(
      configPath
    )
  ) {

    try {

      config = JSON.parse(

        fs.readFileSync(
          configPath,
          "utf8"
        )

      );

    }

    catch (error) {

      console.log(
        "Config Read Error:",
        error
      );

    }

  }

  console.log(
    "CONFIG =",
    config
  );

  if (

    !config.pcName ||

    !config.lab

  ) {

    console.log(
      "OPENING SETUP SCREEN"
    );

    mainWindow.loadFile(

      path.join(
        __dirname,
        "renderer",
        "setup.html"
      )

    );

  }

  else {

    console.log(
      "STARTING AGENT"
    );

    require(
      "./agent/client"
    );

    mainWindow.hide();

  }

}

app.whenReady().then(() => {

  createWindow();

});

ipcMain.handle(

  "save-config",

  async (

    event,

    data

  ) => {

    const configPath =
      path.join(

        __dirname,

        "agent",

        "config.json"

      );

    fs.writeFileSync(

      configPath,

      JSON.stringify(

        data,

        null,

        2

      )

    );

    console.log(
      "CONFIG SAVED"
    );

    console.log(
      data
    );

    require(
      "./agent/client"
    );

    mainWindow.hide();

    return true;

  }

);

app.on(

  "window-all-closed",

  () => {}

);