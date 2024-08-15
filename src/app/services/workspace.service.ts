import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  workspaces = signal<any[]>([]);

  workspace = signal<any>(null);

  currentWorkspaceFolders = signal<{files: { name: string; isDirectory: boolean; stats:any;}[]; folderPath: string} | null>(null);

  folderMusic = new BehaviorSubject<any[]>([]);

  constructor() { }

  getAllWorkspaces() {
    (window as any).electron.selectFromWorkspace().then((workspaces: any[]) => {
      this.workspaces.set(workspaces);
    }).catch((err: any) => {
      console.error('Failed to fetch workspaces', err);
    });
  }

  getOneWorkspaceById(id: number) {
    (window as any).electron.selectOneFromWorkspaceById(id).then((workspace: any) => {
      console.log("workspace");
      console.log(workspace);
      this.workspace.set(workspace);
    }).catch((err: any) => {
      console.error('Failed to fetch workspaces', err);
    });
  }


  getFolderContent(path: string) {
    console.log("path");
    console.log(path);
    (window as any).electron.openFolderByPath(path).then((result: any) => {
      console.log(result);
      this.currentWorkspaceFolders.set(result);
    }).catch((err: any) => {
      console.error('Failed to get folder by path', err);
    });
  }


  getFolderItems(folderName: string) {
    (window as any).electron.getMusicList(this.currentWorkspaceFolders()!.folderPath, folderName).then((result: any) => {
      this.folderMusic.next([]);
      setTimeout(() => {
        this.folderMusic.next(result);
      }, 100);
    });
  }
  

  getFileNotes(filePath: string) {
    return (window as any).electron.getFileNotes(filePath);
  }

  addFileNote(filePath: string, description:string) {
    return (window as any).electron.addFileNote(filePath, description);
  }

  deleteNote(noteId: number) {
    return (window as any).electron.deleteFileNote(noteId);
  }
}
