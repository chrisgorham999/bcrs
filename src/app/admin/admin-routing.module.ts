/*
======================================
; Title: admin-routing.module.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 03 October 2023
; Description: This code supports the Admin Module
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { AdminComponent } from './admin.component';
import { GraphComponent } from './graph/graph.component';
import { NgModule } from '@angular/core';
import { roleGuard } from '../shared/role.guard';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserNewComponent } from './users/user-new/user-new.component';
import { UserViewComponent } from './users/user-view/user-view.component';


// establish routes
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        component: UserListComponent,
        title: 'BCRS: Users'
      },
      {
        path: 'users/:email/view',
        component: UserViewComponent,
        title: 'BCRS: User'
      },
      {
        path: 'users/new',
        component: UserNewComponent,
        title: 'BCRS: New User'
      },
      {
        path: 'graph',
        component: GraphComponent,
        title: 'BCRS: Service Repair Graph'
      }
    ],
    canActivate: [roleGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
