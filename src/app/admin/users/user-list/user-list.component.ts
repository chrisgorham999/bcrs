/*
======================================
; Title: user-list.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 14 September 2023
; Description: This code supports the User List Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserDisableModel } from '../user-disable-model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users: User[]
  successMessage: string
  errorMessage: string
  isLoading: boolean

  constructor(private userService: UserService, private router: Router) {
    this.users = []
    this.successMessage = ''
    this.errorMessage = ''
    this.isLoading = true

    this.userService.getUsers().subscribe({
      next: (users: any) => {
        this.users = users
        console.log('User List:', this.users)
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        console.log(err)
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      }
    })
  }

  disableUser(email: string) {
    if (!confirm('Are you sure you want to delete user record ' + email + '?')) {
      return
    }
    let user = {} as UserDisableModel;
    user.isDisabled = true;
    console.log('You made it here')
    console.log(user) // for troubleshooting purposes

    this.userService.disableUser(email, user).subscribe({
      next: (res) => {
        this.successMessage = 'User disabled successfully'
        this.userService.getUsers();
        //this.pageRefresh() // refreshes the page after 3 seconds to show the updates user list
        this.hideAlert() // hides the alert after 3 seconds

      },
      error: (err) => {
        this.errorMessage = err.message
        console.error(err)
        this.hideAlert()
      }
    })
  }

  // makes alerts disappear after 3 seconds by resetting them to empty values
  hideAlert() {
    setTimeout(() => {
      this.successMessage = ''
      this.errorMessage = ''
    }, 3000)
  }

  // reload the page to show updated user list after a user is disabled
  pageRefresh() {
    setTimeout(() => {
      location.reload()
    }, 1000)
  }


}


