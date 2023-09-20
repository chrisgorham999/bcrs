/*
======================================
; Title: register.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 20 September 2023
; Last Updated: 20 September 2023
; Description: This code supports the Register Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../admin/users/user';
import { UserService } from '../admin/users/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    // establishes error message as a string
    errorMessage: string;

      // form validators
  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.compose([Validators.required])],
    lastName: ['', Validators.compose([Validators.required])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'
        ),
      ]),
    ],
    address: ['', Validators.compose([Validators.required])],
    phoneNumber: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9-]*$'),
      ]),
    ]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    // set error message to empty string
    this.errorMessage = '';
  }

  // registerUser function
  registerUser() {
    const user: User = {
      // pull values from the form
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value,
      firstName: this.registerForm.controls['firstName'].value,
      lastName: this.registerForm.controls['lastName'].value,
      address: this.registerForm.controls['address'].value,
      phoneNumber: this.registerForm.controls['phoneNumber'].value,
      role: "standard",
      // set to false because we're creating a user, we don't want it disabled and the admin shouldn't have to tell us that, it is implied
      isDisabled: false,
      selectedSecurityQuestions: []
    };

    this.userService.createUser(user).subscribe({
      next: (res) => {
        console.log(res); // for troubleshooting purposes
        this.router.navigate(['/admin/users']);
      },
      // error handling
      error: (err) => {
        if (err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage =
            'Something went wrong, please contact system admin';
        }
      },
    });
  }
}
