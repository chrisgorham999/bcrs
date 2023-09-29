/*
======================================
; Title: invoice.service.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 26 September 2023
; Last Updated: 27 September 2023
; Description: This code supports the Invoice Service
; Sources Used: N/A
;=====================================
*/

// imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceModel } from './invoice-model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private http: HttpClient) {}

  createTheInvoice(invoice: InvoiceModel) {
    return this.http.post('/api/invoices/', { invoice });
  }
  getInvoices() {
    return this.http.get('/api/invoices/');
  }

  findPurchasesByServiceGraph() {
    return this.http.get('/api/invoices/graph');
  }
  
  getInvoice(invoiceNumber: string) {
    return this.http.get('/api/invoices/' + invoiceNumber)

  }
}
