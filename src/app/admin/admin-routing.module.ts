/*
======================================
; Title: admin-routing.module.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 29 September 2023
; Description: This code supports the Admin Module
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserNewComponent } from './users/user-new/user-new.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { roleGuard } from '../shared/role.guard';

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
