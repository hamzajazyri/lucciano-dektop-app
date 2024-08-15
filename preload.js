const { contextBridge, ipcRenderer } = require('electron');


console.log("preload runing");

contextBridge.exposeInMainWorld('electron', {
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
  openFolderByPath: (folderPath) => ipcRenderer.invoke('open-folder-by-path', folderPath),


  getMusicList: (folderPath, folderName) => ipcRenderer.invoke('get-music-list', folderPath, folderName),
  
  
  addFileNote: (filePath, description) => ipcRenderer.invoke('add-note', filePath, description),
  deleteFileNote: (id) => ipcRenderer.invoke('delete-note', id),
  updateFileNote: (id, description) => ipcRenderer.invoke('update-note', id, description),
  getFileNotes: (filePath) => ipcRenderer.invoke('select-all-notes-by-filepath', filePath),
  

  // WORKSPACE QUERIES
  insertIntoWorkspaceTable: (path, workspaceName) => ipcRenderer.invoke('insert-into-workspace', path, workspaceName),
  deleteFromWorkspaceTable: (id) => ipcRenderer.invoke('delete-from-workspace', id),
  selectFromWorkspace: () => ipcRenderer.invoke('select-all-from-workspaces'),
  selectOneFromWorkspaceById: (id) => ipcRenderer.invoke('select-one-from-workspaces', id)
});