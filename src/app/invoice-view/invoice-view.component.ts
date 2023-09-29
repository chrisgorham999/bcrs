/*
======================================
; Title: invoice-view.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 27 September 2023
; Last Updated: 28 September 2023
; Description: This code supports the Invoice View Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceModel } from '../invoice-model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent {

  id: string // define the id variable
  invoice: InvoiceModel // define the user variable

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router) {

      this.invoice = {} as InvoiceModel // initialize the user model
      const l_invoiceNumber = this.route.snapshot.paramMap.get('invoiceNumber') || '' // get the id from the route

      this.id = l_invoiceNumber;

      console.log(this.id) // log the email to the console

      // call the invoiceService findInvoiceById() function and subscribe to the observable
      this.invoiceService.getInvoice(this.id).subscribe({
        next: (invoice: any) => {
          this.invoice = invoice // assign the results to the user model
          console.log(this.invoice) // log the results to the console
        },
        error: (err) => {
          console.error(err)
        },
        complete: () => {
          console.log('it all worked, great job!')
        }
      })
    }



}

