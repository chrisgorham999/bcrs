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
import { User } from '../user';
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

  constructor(private userService: UserService) {
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

  deleteUser(email: string) {
    if (!confirm('Are you sure you want to delete user record ' + email + '?')) {
      return
    }

    this.userService.deleteUser(email).subscribe({
      next: (res) => {
        this.users = this.users.filter(user => user.email !== email)

        this.successMessage = 'User deleted successfully'

        this.hideAlert()
      },
      error: (err) => {
        this.errorMessage = err.message
        console.error(err)
        this.hideAlert()
      }
    })
  }

  hideAlert() {
    setTimeout(() => {
      this.successMessage = ''
      this.errorMessage = ''
    }, 3000)
  }
}
