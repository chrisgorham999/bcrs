/*
======================================
; Title: security.service.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 13 September 2023
; Last Updated: 20 September 2023
; Description: This code supports the Security Service for Sign In
; Sources Used: N/A
;=====================================
*/

// imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterViewModel } from './signin/register-view-model';
import { selectedSecurityQuestionsViewModel } from './signin/selected-security-questions-view-model';


@Injectable({
  providedIn: 'root'
})

export class SecurityService {

  constructor(private http: HttpClient) { }

  signin(email: string, password: string) {
    return this.http.post('/api/security/signin', {
      email,
      password
    }) // returns the signin function
  }

  register(user: RegisterViewModel) {
    return this.http.post('/api/security/register', { user }) // returns the register function
  }

  verifyEmail(email: string) {
    return this.http.post('/api/security/verify/users/' + email, { }) // returns the verifyEmail function
  }

  findSelectedSecurityQuestions(email: string) {
    return this.http.get('/api/users/' + email + '/security-questions') // returns the findSelectedSecurityQuestions function
  }

  verifySecurityQuestions(email: string, securityQuestions: selectedSecurityQuestionsViewModel[]): Observable<any> {
    return this.http.post('/api/security/verify/users/' + email + '/security-questions', { securityQuestions }) // returns the verifySecurityQuestions function
  }

  changePassword(email: string, password: string): Observable<any> {
    return this.http.post('/api/security/users/' + email + '/reset-password', { password }) // returns the changePassword function
  }

}