/*
======================================
; Title: auth.guard.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 14 September 2023
; Description: This code supports the Auth Guard
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/


// imports
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'
import { inject } from '@angular/core'

// export
export const authGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService)

  if (cookie.get('session_user')) {
    console.log('You are logged in and have a valid session cookie') // for troubleshooting purposes
    return true
  } else {
    console.log('You must be logged in to access this page!')
    const router = inject(Router)
    // redirect to sign in if not a session user
    router.navigate(['/security/signin'], {queryParams: { returnUrl: state.url }})
    return false
  }
};