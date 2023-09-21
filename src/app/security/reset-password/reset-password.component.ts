/*
======================================
; Title: reset-password.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 20 September 2023
; Last Updated: 21 September 2023
; Description: This code supports the Reset Password Component
; Sources Used: Bellevue University WEB-450 Coding Sessions
;=====================================
*/

// imports
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../security.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  errorMessage: string // error message variable
  email: string // email address variable
  isLoading: boolean = false // loading variable

  // change password form
  changePasswordForm: FormGroup = this.fb.group({
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'
        ),
      ]),
    ],
  })

  constructor(private fb: FormBuilder, private securityService: SecurityService, private route: ActivatedRoute, private router: Router) {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '' // get the email address from the query string
    this.errorMessage = '' // init the errorMessage variable

    // if no email address is found, redirect to the forgot password page
    if (!this.email) {
      console.log('No email address found')
      this.router.navigate(['/security/signin'])
    } // end if
  } // end constructor

  changePassword() {
    this.isLoading = true // set the isLoading variable to true
    const password = this.changePasswordForm.controls['password'].value // get the password from the form

    this.securityService.changePassword(this.email, password).subscribe({
      next: (data) => {
        console.log(data)
        this.router.navigate(['/security/signin']) // redirect to the signin page
      },
      error: (err) => {
        console.log(err)
        this.errorMessage = err // assign the error message
        this.isLoading = false // set the isLoading variable to false
      },
      complete: () => {
        this.isLoading = false // set the isLoading variable to false
      }
    })

  }

}
