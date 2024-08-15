import { Routes } from '@angular/router';
import { WorkspaceDetailComponent } from './pages/workspace-detail/workspace-detail.component';
import { WorkspacesComponent } from './pages/workspaces/workspaces.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'workspaces'
    }, {
        path: 'workspaces',
        component: WorkspacesComponent
    },{
        path: 'workspace-detail/:id',
        component: WorkspaceDetailComponent
    }
];
