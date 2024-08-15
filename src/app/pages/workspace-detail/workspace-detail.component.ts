import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { WorkspaceService } from '../../services/workspace.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { MusicItemComponent } from '../../components/music-item/music-item.component';

@Component({
  selector: 'app-workspace-detail',
  standalone: true,
  imports: [JsonPipe, NgClass, MusicItemComponent, AsyncPipe],
  templateUrl: './workspace-detail.component.html',
  styleUrl: './workspace-detail.component.scss'
})
export class WorkspaceDetailComponent implements OnInit {
  
  workspaceSrv = inject(WorkspaceService);
  activatedRoute = inject(ActivatedRoute);

  currentFolderIndex = signal(-1);

  ngOnInit(): void {
    this.workspaceSrv.getOneWorkspaceById(parseInt(this.activatedRoute.snapshot.paramMap.get('id')!));
    
    setTimeout(() => {
      if(this.workspaceSrv.workspace().path) {
        console.log(this.workspaceSrv.workspace().path)
        this.workspaceSrv.getFolderContent(this.workspaceSrv.workspace().path);
      }
    }, 100);
  }

  getFolderItems(item:any, index: number) {
    this.currentFolderIndex.set(index);
    this.workspaceSrv.getFolderItems(item.name);
  }

}
