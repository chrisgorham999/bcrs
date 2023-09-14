/*
======================================
; Title: signin.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 13 September 2023
; Last Updated: 13 September 2023
; Description: This code supports the Security Service for Sign In
; Sources Used: N/A
;=====================================
*/

// imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class SecurityService {

  constructor(private http: HttpClient) { }

  signin(email: string, password: string) {
    return this.http.post('/api/security/signin', {
      email,
      password
    })
  }

}