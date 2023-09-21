/*
======================================
; Title: register-view-model.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 20 September 2023
; Last Updated: 20 September 2023
; Description: This code supports the Register View Model
; Sources Used: Bellevue University WEB-450 Coding Sessions
;=====================================
*/

// imports
import { selectedSecurityQuestionsViewModel } from "./selected-security-questions-view-model"

// exports
export interface RegisterViewModel {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  address: string
  selectedSecurityQuestions: selectedSecurityQuestionsViewModel[]
}