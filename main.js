const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const database = require('./database');



const env = process.env.NODE_ENV || '_development';

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      sandbox: true,
      nodeIntegration: false,  // Disable Node.js integration in renderer
      contextIsolation: true,  // Enable context isolation
      preload: path.join(__dirname, 'preload.js')  // Path to preload script
    }
  });

  // Adjust the path resolution for packaged apps
  const startUrl = path.join(__dirname, 'dist', 'lucciano', 'browser', 'index.html');

  mainWindow.loadFile(startUrl);
};

const openFolderByPath = async (folderPath) => {
  const files = fs.readdirSync(folderPath).map(file => {
    return {
      name: file,
      isDirectory: fs.statSync(path.join(folderPath, file)).isDirectory(),
      stats: fs.statSync(path.join(folderPath, file))
    };
  });

  return { folderPath, files };
}

// Function to open folder and get its contents
const openFolder = async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (result.canceled) {
    return;
  }

  const folderPath = result.filePaths[0];
  return openFolderByPath(folderPath);
};


// Helper function to check if a file is a music file
const isMusicFile = (fileName) => {
  const musicExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg']; // Add more extensions as needed
  const ext = path.extname(fileName).toLowerCase();
  return musicExtensions.includes(ext);
};



app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.handle('open-folder-dialog', async () => {
    return openFolder();
  });

  ipcMain.handle('open-folder-by-path', async (event, folderPath) => {
    return openFolderByPath(folderPath);
  });

  

  ipcMain.handle('insert-into-workspace', (event, path, workspaceName) => {
    console.log(event);
    console.log('path '+ path);
    console.log('workspacename'+ workspaceName);
    return new Promise((resolve, reject) => {
      database.insertWorkspace(path, workspaceName, (err, id) => {
        if (err) reject(err);
        else resolve(id);
      });
    });
  });

  ipcMain.handle('delete-from-workspace', (event, id) => {
    return new Promise((resolve, reject) => {
      database.deleteWorkspace(id, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  ipcMain.handle('select-all-from-workspaces', () => {
    return new Promise((resolve, reject) => {
      database.getAllWorkspaces((err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  ipcMain.handle('select-one-from-workspaces', (event, id) => {
    return new Promise((resolve, reject) => {
      database.getWorkspaceById(id, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  });

  ipcMain.handle('get-music-list', (event, folderPath, folderName) => {
    try {
      const fullPath = path.join(folderPath, folderName);
  
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Folder does not exist: ${fullPath}`);
      }
  
      const files = fs.readdirSync(fullPath);
      const musicFiles = files.filter(isMusicFile).map(file => {
        const filePath = path.join(fullPath, file);
        const stats = fs.statSync(filePath);
  
        return {
          name: file,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      });
  
      return musicFiles;
    } catch (error) {
      console.error(`Error reading music files from folder: ${folderPath}/${folderName}`, error.message);
      throw error;
    }
  });


  ipcMain.handle('add-note', async (event, filePath, description) => {
    return new Promise((resolve, reject) => {
      database.addNote(filePath, description, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  });
  ipcMain.handle('update-note', async (event, id, description) => {
    
  });
  
  ipcMain.handle('select-all-notes-by-filepath', async (event,filePath) => {
    return new Promise((resolve, reject) => {
      database.getNoteByPath(filePath, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  ipcMain.handle('delete-note', async (event, id) => {
    return new Promise((resolve, reject) => {
      database.deleteNoteById(id, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


