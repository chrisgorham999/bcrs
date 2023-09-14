/*
======================================
; Title: admin.module.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 14 September 2023
; Description: This code supports the Admin Module
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserNewComponent } from './users/user-new/user-new.component';
import { UserViewComponent } from './users/user-view/user-view.component';

@NgModule({
  declarations: [
    AdminComponent,
    UserListComponent,
    UserNewComponent,
    UserViewComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class AdminModule { }
