/*
======================================
; Title: app.module.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 07 September 2023
; Last Updated: 20 September 2023
; Description: This code supports the App Module and handles all imports
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports statements
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FaqComponent } from './faq/faq.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavComponent } from './layouts/nav/nav.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { DirectoryComponent } from './directory/directory.component';
import { ServiceRepairComponent } from './service-repair/service-repair.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BaseLayoutComponent,
    FaqComponent,
    FooterComponent,
    NavComponent,
    NotFoundComponent,
    DirectoryComponent,
    ServiceRepairComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
