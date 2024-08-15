import { Component, inject, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-new-popup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './workspace-new-popup.component.html',
  styleUrl: './workspace-new-popup.component.scss'
})
export class WorkspaceNewPopupComponent {

  workspaceSrv = inject(WorkspaceService);

  uClose = output();

  workspaceName = new FormControl();
  folderPath: string = '';
  files: { name: string, isDirectory: boolean }[] = [];

  get folderCount()  {
    return this.files.filter( f => f.isDirectory).length;
  }

  openFolder() {
    (window as any).electron.openFolderDialog().then((result: { folderPath: string, files: { name: string, isDirectory: boolean }[] }) => {
      if (result) {
        this.folderPath = result.folderPath;
        this.files = result.files;
      }
    }).catch((err: any) => {
      console.error('Failed to open folder', err);
    });
  }

  createWorkspace() {
    console.log("create workspace works");
    console.log(this.folderPath);
    console.log(this.workspaceName.value);
    (window as any).electron.insertIntoWorkspaceTable(this.folderPath, this.workspaceName.value).then((id: number) => {
      console.log(`Workspace inserted with ID: ${id}`);
      this.workspaceSrv.getAllWorkspaces();
      this.uClose.emit();
    }).catch((err: any) => {
      console.error('Failed to insert workspace', err);
    });
  }

}
