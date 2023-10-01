/*
======================================
; Title: profile-success.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 30 September 2023
; Last Updated: 30 September 2023
; Description: This code supports the Profile Success Component
; Sources Used: N/A
;=====================================
*/

// imports
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-success',
  templateUrl: './profile-success.component.html',
  styleUrls: ['./profile-success.component.css']
})
export class ProfileSuccessComponent implements OnInit {

  constructor (public dialogRef: MatDialogRef<ProfileSuccessComponent>) {}

  ngOnInit(): void {

  }
  //function to close the dialog
  close() {
    this.dialogRef.close();
  }
}
