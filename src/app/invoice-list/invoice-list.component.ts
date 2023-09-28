/*
======================================
; Title: invoice.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 27 September 2023
; Last Updated: 27 September 2023
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

  invoices: InvoiceModel[]
  successMessage: string
  errorMessage: string
  isLoading: boolean

  constructor(private invoiceService: InvoiceService, private router: Router) {
    this.invoices = []
    this.successMessage = ''
    this.errorMessage = ''
    this.isLoading = true

    this.invoiceService.getInvoices().subscribe({
      next: (invoices: any) => {
        this.invoices = invoices
        console.log('Invoice List:', this.invoices)
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        console.log(err)
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