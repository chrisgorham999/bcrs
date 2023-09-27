/*
======================================
; Title: service-repair.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 26 September 2023
; Last Updated: 26 September 2023
; Description: This code supports the Service Repair Component
; Sources Used: Bellevue University WEB-450 Coding Sessions
;=====================================
*/


// imports
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { InvoiceModel } from '../invoice-model';

// the interface for the local Service that will assign the services name, price, and a state to tell whether they have been checked or not
interface Service {
  name: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})
export class ServiceRepairComponent {


  // establish form group and define validators
  invoiceForm: FormGroup = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    fullName: ['', Validators.compose([Validators.required])],
  })

  // populate the services variable with the name of the service, price, and set them to unselected to start
  services: Service[] = [
    { name: 'Password Reset', price: 39.99, selected: false },
    { name: 'Spyware Removal', price: 99.99, selected: false },
    { name: 'RAM Upgrade', price: 129.99, selected: false },
    { name: 'Software Installation', price: 49.99, selected: false},
    { name: 'PC Tune-up', price: 89.99, selected: false},
    { name: 'Keyboard Cleaning', price: 45.00, selected: false},
    { name: 'Disk Clean-up', price: 129.99, selected: false}
  ];

  // initialize variables for error messages and calculations
  parts: number = 0;
  labor: number = 0;
  totalCost: number = 0;
  errorMessage: string;


  constructor(private fb: FormBuilder, private router: Router, private invoiceService: InvoiceService) {
    this.errorMessage = '';
  }

  // the function that calculates the live running total on the page
  calculateTotal(): void {
    const servicesCost = this.services
      .filter(service => service.selected)
      .reduce((total, service) => total + service.price, 0);

      const laborPrice = this.labor *50;
      const partsPrice = this.parts;
      this.totalCost = servicesCost + laborPrice + partsPrice;
  }

  // creates the invoice and pushes it to the database
  createInvoice() {
    const servicesCost = this.services
    .filter(service => service.selected)
    .reduce((total, service) => total + service.price, 0);

    const laborPrice = this.labor *50;
    const partsPrice = this.parts;
    this.totalCost = servicesCost + laborPrice + partsPrice;

    const invoice: InvoiceModel = {
      email: this.invoiceForm.controls['email'].value, // pulls the email from the form on the page
      fullName: this.invoiceForm.controls['fullName'].value, // pulls the full name from the form on the page
      partsAmount: partsPrice,
      laborAmount: laborPrice,
      lineItemTotal: servicesCost,
      invoiceTotal: this.totalCost,
      orderDate: "test", // need to fix
      lineItems: [ // need to fix
        {
        name: "test",
        price: 100,
      }
    ]
    };

    // calls the invoice Service to create an invoice
    this.invoiceService.createTheInvoice(invoice).subscribe({
      next: (res) => {
        console.log(res); // for troubleshooting
        this.router.navigate(['/service-repair']);
      },
      // error handling
      error: (err) => {
        if (err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Something went wrong, please contact the system administrator.'
        }
      }
    })
  }
}


