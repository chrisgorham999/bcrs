/*
======================================
; Title: verify-email.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 20 September 2023
; Last Updated: 21 September 2023
; Description: This code supports the Verify Email Component
; Sources Used: Bellevue University WEB-450 Coding Sessions
;=====================================
*/

// imports
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../security.service';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})

export class VerifyEmailComponent {
  errorMessage: string // error message variable
  isLoading: boolean = false // loading variables

  // email form group for the verify email form
  emailForm: FormGroup = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])]
  })

  // constructor with form builder, router, and security service parameters
  constructor(private fb: FormBuilder, private router: Router, private securityService: SecurityService) {
    this.errorMessage = ''
  }

  // verifyEmail function to verify the email address entered by the user
  verifyEmail() {
    this.isLoading = true // set the isLoading variable to true

    const email = this.emailForm.controls['email'].value // get the email from the form
    // call the security service verifyEmail function to verify the email address
    this.securityService.verifyEmail(email).subscribe({
      // if the email address is found, navigate to the verify security questions page
      next: (res) => {
        console.log(res)
        this.router.navigate(['security/verify-security-questions'], { queryParams: { email }, skipLocationChange: true}) // navigate to the verify security questions while hiding the email in the navigation link bar
      },
      // if there is an error, log the error to the console
      error: (err) => {
        console.log('Server Error from verifyEmail Call:', err)

        // if the error status is 404, assign the error message
        if (err.status === 404) {
          this.errorMessage = 'The email address you entered was not found.'
          return
        }

        // if the error status is 500, assign the error message
        this.errorMessage = 'There was a problem verifying your email address. Please contact the system administrator.'
        this.isLoading = false
      },
      // if the call is complete, set the isLoading variable to false
      complete: () => {
        this.isLoading = false // set the isLoading variable to false
      }
    })
  }

}
