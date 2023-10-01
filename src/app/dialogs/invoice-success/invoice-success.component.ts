/*
======================================
; Title: invoice-success.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 30 September 2023
; Last Updated: 30 September 2023
; Description: This code supports the Invoice Success Component
; Sources Used: N/A
;=====================================
*/

// imports
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-success',
  templateUrl: './invoice-success.component.html',
  styleUrls: ['./invoice-success.component.css']
})
export class InvoiceSuccessComponent implements OnInit {

  constructor (public dialogRef: MatDialogRef<InvoiceSuccessComponent>) {}

  ngOnInit(): void {

  }
  //function to close the dialog
  close() {
    this.dialogRef.close();
  }
}