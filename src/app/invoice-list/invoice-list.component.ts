/*
======================================
; Title: invoice-list.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 27 September 2023
; Last Updated: 28 September 2023
; Description: This code supports the Invoice List Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { Component } from '@angular/core';
import { InvoiceModel } from '../invoice-model';
import { InvoiceService } from '../invoice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent {
  // init variables
  invoices: InvoiceModel[]
  successMessage: string
  errorMessage: string
  isLoading: boolean

  constructor(private invoiceService: InvoiceService, private router: Router) {
    this.invoices = [] // set invoices to blank array
    this.successMessage = '' // success message to blank
    this.errorMessage = '' // set errorMessage to blank
    this.isLoading = true // set isLoading to true

    this.invoiceService.getInvoices().subscribe({
      next: (invoices: any) => {
        this.invoices = invoices
        console.log('Invoice List:', this.invoices) // for troubleshooting purposes
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        console.log(err) // for troubleshooting purposes
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      }
    })
  }

  // makes alerts disappear after 3 seconds by resetting them to empty values
  hideAlert() {
    setTimeout(() => {
      this.successMessage = ''
      this.errorMessage = ''
    }, 3000)
  }
}
