/*
======================================
; Title: signin.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 13 September 2023
; Last Updated: 13 September 2023
; Description: This code supports the Sign In Component
; Sources Used: N/A
;=====================================
*/

// imports
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../security.service';


export interface SessionUser {

  // define variables
  email: string;
  firstName: string;
  lastName: string;
}


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
    // define variables
    errorMessage: string
    sessionUser: SessionUser
    isLoading: boolean = false

      // form validators - must be a number and is a required entry
  signinForm = this.fb.group({
    empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
  })

  constructor(private fb: FormBuilder, private router: Router, private cookieService: CookieService, private secService: SecurityService, private route: ActivatedRoute) {
    this.sessionUser = {} as SessionUser
    this.errorMessage = ''
  }

  // the sign in function
 // signin() {
 //   this.isLoading = true;
  //  const empId = this.signinForm.controls['empId'].value

   // if (!empId || isNaN(parseInt(empId, 10))) {
     // this.errorMessage = 'The employee ID you entered is invalid, please try again'
     // this.isLoading = false
     // return
    }
    // finds the employee ID number in the database
 //   this.secService.findUserById(empId).subscribe({
 //     next: (employee: any) => {
 //       this.sessionUser = employee
 //       this.cookieService.set('session_user', empId, 1)
 //       this.cookieService.set('session_name', `${employee.firstName} $   {employee.lastName}`, 1)
 //       const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'

   //     this.isLoading = false;
     //   this.router.navigate([returnUrl])
  //    },
      // error handling
    //  error: (err) => {
     //   this.isLoading = false
     //   if (err.error.message) {
     //     this.errorMessage = err.error.message
    //      return
   //     }
 //     }
 //   })
//  }

// }
