import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { InvoiceModel } from '../invoice-model';


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

  invoiceForm: FormGroup = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    fullName: ['', Validators.compose([Validators.required])],
  })
  services: Service[] = [
    { name: 'Password Reset', price: 39.99, selected: false },
    { name: 'Spyware Removal', price: 99.99, selected: false },
    { name: 'RAM Upgrade', price: 129.99, selected: false },
    { name: 'Software Installation', price: 49.99, selected: false},
    { name: 'PC Tune-up', price: 89.99, selected: false},
    { name: 'Keyboard Cleaning', price: 45.00, selected: false},
    { name: 'Disk Clean-up', price: 129.99, selected: false}
  ];

  parts: number = 0;
  labor: number = 0;
  totalCost: number = 0;
  errorMessage: string;


  constructor(private fb: FormBuilder, private router: Router, private invoiceService: InvoiceService) {
    this.errorMessage = '';
  }

  calculateTotal(): void {
    const servicesCost = this.services
      .filter(service => service.selected)
      .reduce((total, service) => total + service.price, 0);

      const laborPrice = this.labor *50;
      const partsPrice = this.parts;
      this.totalCost = servicesCost + laborPrice + partsPrice;
  }

  createInvoice() {
    const servicesCost = this.services
    .filter(service => service.selected)
    .reduce((total, service) => total + service.price, 0);

    const laborPrice = this.labor *50;
    const partsPrice = this.parts;
    this.totalCost = servicesCost + laborPrice + partsPrice;

    const invoice: InvoiceModel = {
      email: this.invoiceForm.controls['email'].value,
      fullName: this.invoiceForm.controls['fullName'].value,
      partsAmount: partsPrice,
      laborAmount: laborPrice,
      lineItemTotal: servicesCost,
      invoiceTotal: this.totalCost,
      orderDate: "test",
      lineItems: {
        name: "test",
        price: 100,
      }
    };

    this.invoiceService.createTheInvoice(invoice).subscribe({
      next: (res) => {
        console.log(res); // for troubleshooting
        this.router.navigate(['/admin/users']);
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


