import { Component, inject, OnInit, signal } from '@angular/core';
import { WorkspaceNewPopupComponent } from '../../components/workspace-new-popup/workspace-new-popup.component';
import { NgClass } from '@angular/common';
import { WorkspaceService } from '../../services/workspace.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspaces',
  standalone: true,
  imports: [
    NgClass,
    WorkspaceNewPopupComponent
  ],
  templateUrl: './workspaces.component.html',
  styleUrl: './workspaces.component.scss'
})
export class WorkspacesComponent implements OnInit {

  workspaceSrv = inject(WorkspaceService);
  router = inject(Router);

  workspaceNewPopupOpen = signal(false);
  workspaces : any[] = [];

  fetchAllWorkspaces() {
    this.workspaceSrv.getAllWorkspaces();
  }

  ngOnInit(): void {
    this.workspaceSrv.getAllWorkspaces();
  }

  navigateToWorkspaceDetail(workspaceId: number) {
    this.router.navigateByUrl(`/workspace-detail/${workspaceId}`);
  }
}
