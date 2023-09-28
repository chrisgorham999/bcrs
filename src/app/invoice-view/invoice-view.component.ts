import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceModel } from '../invoice-model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent {

  id: string // define the email variable
  invoice: InvoiceModel // define the user variable

  // form validators
  invoiceForm: FormGroup = this.fb.group({
  })

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router,
    private fb: FormBuilder) {

      this.invoice = {} as InvoiceModel // initialize the user model
      let invoiceID = this.route.snapshot.paramMap.get('invoiceNumber') || '' // get the id from the route

      this.id = invoiceID;

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
          // populate form with values from the db
          this.invoiceForm.controls['fullName'].setValue(this.invoice.fullName)
          this.invoiceForm.controls['email'].setValue(this.invoice.email)
          this.invoiceForm.controls['partsAmount'].setValue(this.invoice.partsAmount)
          this.invoiceForm.controls['laborAmount'].setValue(this.invoice.laborAmount)
        }
      })
    }



}

