/*
======================================
; Title: user-new.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 16 September 2023
; Description: This code supports the New User Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';



@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent {

  // establishes error message as a string
  errorMessage: string;

  // form validators
  userForm: FormGroup = this.fb.group({
    firstName: ['', Validators.compose([Validators.required])],
    lastName: ['', Validators.compose([Validators.required])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])],
    address: ['', Validators.compose([Validators.required])],
    role: ['', Validators.compose([Validators.required])],
    phoneNumber: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9-]*$")])]
  })

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {

    // set error message to empty string
    this.errorMessage = '';

  }

  // createUser function
  createUser() {
    const user: User = {
      // pull values from the form
      email: this.userForm.controls['email'].value,
      password: this.userForm.controls['password'].value,
      firstName: this.userForm.controls['firstName'].value,
      lastName: this.userForm.controls['lastName'].value,
      phoneNumber: this.userForm.controls['phoneNumber'].value,
      address: this.userForm.controls['address'].value,
      role: this.userForm.controls['role'].value,
      // set to false because we're creating a user, we don't want it disabled and the admin shouldn't have to tell us that, it is implied
      isDisabled: false,
      // add in the functionality for this later
      selectedSecurityQuestions: [
      ]
    }

  this.userService.createUser(user).subscribe({
    next: (res) => {
      console.log(res) // for troubleshooting purposes
      this.router.navigate(['/admin/users'])
    },
    // error handling
    error: (err) => {
      if (err.error.message) {
        this.errorMessage = err.error.message
      } else {
        this.errorMessage = 'Something went wrong, please contact system admin'
      }
    }
  })

}
}
