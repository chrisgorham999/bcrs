/*
======================================
; Title: user.service.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 14 September 2023
; Description: This code supports the User Service
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { UserDisableModel } from './user-disable-model';
import { UserViewModel } from './user-view-model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // the http client gets for all functions
  getUsers() {
    return this.http.get('/api/users')
  }

  getUser(email: string) {
    return this.http.get('/api/users/' + email)
  }

  createUser(user: User) {
    return this.http.post('/api/users/', {
      user
    })
  }

  updateUser(email: string, user: UserViewModel) {
    return this.http.put('/api/users/' + email, {
      user
    })
  }

  disableUser(email: string, user: UserDisableModel) {
    return this.http.delete('/api/users/' + email)
    }

}


