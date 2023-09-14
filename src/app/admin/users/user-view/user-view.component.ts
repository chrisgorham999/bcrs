/*
======================================
; Title: user-view.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 14 September 2023
; Description: This code supports the View User Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { UserViewModel } from '../user-view-model';


@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent {
  email: string // define the email variable
  user: User // define the user variable

  // form validators
  userForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    role: [null, Validators.compose([Validators.required])]
  })

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder) {

      this.user = {} as User // initialize the user model
      let l_email = this.route.snapshot.paramMap.get('email') || '' // get the email from the route

      this.email = l_email;

      console.log(this.email) // log the email to the console

      // call the userService findUserById() function and subscribe to the observable
      this.userService.getUser(this.email).subscribe({
        next: (user: any) => {
          this.user = user // assign the results to the user model
          console.log(this.user) // log the results to the console
        },
        error: (err) => {
          console.error(err)
        },
        complete: () => {
          // populate form with values from the db
          this.userForm.controls['firstName'].setValue(this.user.firstName)
          this.userForm.controls['lastName'].setValue(this.user.lastName)
          this.userForm.controls['role'].setValue(this.user.role)
        }
      })
    }

    // updateUser() function definition that accepts no parameters and returns nothing (void)
    updateUser() {
      let user = {} as UserViewModel // initialize the user view model

      // assign the values from the form to the user view model
      user.firstName = this.userForm.controls['firstName'].value
      user.lastName = this.userForm.controls['lastName'].value
      user.role = this.userForm.controls['role'].value

      console.log('User ViewModel: ', user) // log the user view model to the console

      // call the userService updateUser() function and subscribe to the observable
      this.userService.updateUser(this.email, user).subscribe({
        next: (res) => {
          console.log(res)
          this.router.navigate(['/admin/users']) // redirect to the user list page
        },
        error: (err) => {
          console.error(err) // log the error to the console
        }
      })

}
}