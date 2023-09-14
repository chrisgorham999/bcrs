/*
======================================
; Title: security-routing.module.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 13 September 2023
; Last Updated: 14 September 2023
; Description: This code supports Security Routing
; Sources Used: N/A
;=====================================
*/

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    title: 'BCRS: Security',
    children: [
      {
        path: 'signin',
        component: SigninComponent,
        title: 'BCRS: Sign In'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
