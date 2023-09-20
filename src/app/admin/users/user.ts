/*
======================================
; Title: user.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 19 September 2023
; Description: This code supports the User Interface
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// export the User
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  address: string;
  isDisabled: boolean;
  selectedSecurityQuestions: [];
}