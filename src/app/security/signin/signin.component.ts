/*
======================================
; Title: signin.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 13 September 2023
; Last Updated: 14 September 2023
; Description: This code supports the Sign In Component
; Sources Used: N/A
;=====================================
*/

// imports
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, Validators } from '@angular/forms';
import { SecurityService } from './../security.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  errorMessage: string
  isLoading: boolean = false

  signinForm = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])]
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private secService: SecurityService,
    private route: ActivatedRoute
  ) {
    this.errorMessage = ''
  }

  signin() {
    this.isLoading = true;

    console.log('Sign in Form:', this.signinForm.value)

    let email = this.signinForm.controls['email'].value
    let password = this.signinForm.controls['password'].value

    if (!email || !password) {
      this.errorMessage = 'Please provide an email address and password'
      this.isLoading = false;
      return
    }

    this.secService.signin(email, password).subscribe({
      next: (user: any) => {
        console.log('User:', user)

        const sessionCookie = {
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role
        }

        this.cookieService.set('session_user', JSON.stringify(sessionCookie), 1)

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'

        this.isLoading = false

        this.router.navigate([returnUrl])
      },
      error: (err) => {
        this.isLoading = false

        console.log('err', err)

        if (err.error.status === 401) {
          this.errorMessage = err.message
          return
        }
      }
    })

  }
}
