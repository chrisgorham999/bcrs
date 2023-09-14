/*
======================================
; Title: role.guard.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 14 September 2023
; Description: This code supports the Role Guard
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'
import { inject } from '@angular/core'

export const roleGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService)

  let sessionUser = JSON.parse(cookie.get('session_user'))

  console.log('Session User:', sessionUser) // for troubleshooting purposes

  if (!sessionUser) {
    console.log('You must be logged in to access this page!')
    const router = inject(Router)
    // redirect to sign in if not a session user
    router.navigate(['/security/signin'], { queryParams: {returnUrl: state.url }})
    return false
  }

  if (sessionUser.role !== 'admin') {
    return false
  }

  return true
};