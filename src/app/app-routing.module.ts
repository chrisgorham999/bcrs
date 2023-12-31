/*
======================================
; Title: app-routing.module .ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 07 September 2023
; Last Updated: 03 October 2023
; Description: This code supports all routes
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports statements
import { authGuard } from './shared/auth.guard';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { DirectoryComponent } from './directory/directory.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule, Routes } from '@angular/router';
import { ServiceRepairComponent } from './service-repair/service-repair.component';

// routes array with a path, component, and title for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'BCRS: Home', // title for the home page
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'BCRS: Home',
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
        title: 'Error: Page Not Found',
      },
      {
        path: 'faq',
        component: FaqComponent,
        title: 'BCRS: FAQ',
      },
      {
        path: 'directory',
        component: DirectoryComponent,
        title: 'BCRS: Employee Directory',
      },
      {
        path: 'service-repair',
        component: ServiceRepairComponent,
        title: 'BCRS: Service Repair',
      },
      {
        path: 'invoice-list',
        component: InvoiceListComponent,
        title: 'BCRS: Invoice List',
      },
      {
        path: 'invoice-list/:invoiceNumber/view',
        component: InvoiceViewComponent,
        title: 'BCRS: Invoice View',
      },
      {
        path: 'users/:email/profile',
        component: ProfileComponent
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
        canActivate: [authGuard],
      },
    ],
  },
  {
    // path for the security module (e.g. login, register, forgot password, etc.)
    path: 'security',
    loadChildren: () =>
      import('./security/security.module').then((m) => m.SecurityModule),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
