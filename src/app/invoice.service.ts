import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceModel } from './invoice-model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  createTheInvoice(invoice: InvoiceModel) {
    return this.http.post('/api/invoices/', { invoice })
  }
}
