/*
======================================
; Title: security.module.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 13 September 2023
; Last Updated: 13 September 2023
; Description: This code supports the Security Service and Sign In Component
; Sources Used: N/A
;=====================================
*/

// imports statements
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SecurityComponent } from './security.component';
import { SecurityRoutingModule } from './security-routing.module';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  declarations: [
    SecurityComponent,
    SigninComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    SecurityRoutingModule
  ]
})
export class SecurityModule { }
