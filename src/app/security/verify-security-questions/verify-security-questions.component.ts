/*
======================================
; Title: verify-security-questions.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 20 September 2023
; Last Updated: 21 September 2023
; Description: This code supports the Verify Security Questions Component
; Sources Used: Bellevue University WEB-450 Coding Sessions
;=====================================
*/

// imports
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../security.service';
import { selectedSecurityQuestionsViewModel } from '../signin/selected-security-questions-view-model';

@Component({
  selector: 'app-verify-security-questions',
  templateUrl: './verify-security-questions.component.html',
  styleUrls: ['./verify-security-questions.component.css']
})
export class VerifySecurityQuestionsComponent {
  selectedSecurityQuestions: selectedSecurityQuestionsViewModel[] // security question view model array
  // define & setup variables
  email: string
  errorMessage: string
  isLoadingLabels: boolean
  isLoadingSubmit: boolean
  question1: string
  question2: string
  question3: string

  // Angular form group for the security questions form
  sqForm: FormGroup = this.fb.group({
    answer1: ['', Validators.compose([Validators.required])],
    answer2: ['', Validators.compose([Validators.required])],
    answer3: ['', Validators.compose([Validators.required])]
  })

 constructor(private route: ActivatedRoute, private router: Router, private securityService: SecurityService, private fb: FormBuilder) {
  this.selectedSecurityQuestions = [] // init the array
  this.question1 = '' // init the question1 variable
  this.question2 = '' // init the question2 variable
  this.question3 = '' // init the question3 variable
  this.errorMessage = '' // init the errorMessage variable
  this.isLoadingLabels = true // init the isLoadingLabels variable
  this.isLoadingSubmit = false // init the isLoadingSubmit variable
  this.email = this.route.snapshot.queryParamMap.get('email') ?? '' // get the email address from the query string

  // if no email address is found, redirect to the forgot password page
  if (!this.email) {
    this.router.navigate(['/security/forgot-password']) // redirect to the forgot password page
    return
  }

  this.securityService.findSelectedSecurityQuestions(this.email).subscribe({
    next: (data: any) => {
      this.selectedSecurityQuestions = data.selectedSecurityQuestions // assign the data to the selectedSecurityQuestions array
      console.log('Users selected security questions', this.selectedSecurityQuestions)
    },
    // if there is an error, log the error to the console
    error: (err) => {
      console.log('Server Error from findSelectedSecurityQuestion Call:', err)

      // if the error status is 404, the email address was not found
      if (err.status === 404) {
        this.errorMessage = 'The email address you entered was not found.'
        return
      } else {
        // if the error status is not 404, there was a server error
        this.errorMessage = 'There was a problem verifying your security questions. Please try again.'
      } // end if
      this.isLoadingLabels = false // set the isLoading variable to false
    },
    complete: () => {
      this.question1 = this.selectedSecurityQuestions[0].question // assign the first question to the question1 variable
      this.question2 = this.selectedSecurityQuestions[1].question // assign the first question to the question2 variable
      this.question3 = this.selectedSecurityQuestions[2].question // assign the first question to the question3 variable

      this.isLoadingLabels = false // set the isLoadingLabels to false
    } // end complete
  }) // end subscribe
 } // end constructor


// local selected security questions array
verifySecurityQuestions () {
  this.isLoadingSubmit = true // set the isLoading variable to true
  console.log(this.sqForm.value)

  // local security questions array with the questions and answers from the form
  let securityQuestions = [
    {
      question: this.question1,
      answer: this.sqForm.controls['answer1'].value
    },
    {
      question: this.question2,
      answer: this.sqForm.controls['answer2'].value
    },
    {
      question: this.question3,
      answer: this.sqForm.controls['answer3'].value
    }
  ] // end securityQuestions

  console.log('User provided security questions', securityQuestions)

  // call the security service verifySecurityQuestions function with the email address and security questions array
  this.securityService.verifySecurityQuestions(this.email, securityQuestions).subscribe({
    // if the observable is successful, navigate to the reset password page
    next: (res) => {
      console.log('Response from verifySecurityQuestions Call:', res)
      this.router.navigate(['/security/reset-password'], { queryParams: { email: this.email }, skipLocationChange: true })
    },
    // if there is an error, log the error to the console
    error: (err) => {
      if (err.error.message) {
        this.errorMessage = err.error.message
        console.error('Server Error from verifySecurityQuestions Call:', err.error.message)
        return
      } else {
        console.error('Server Error from verifySecurityQuestions Call:', err)
        this.errorMessage = 'There was a problem verifying your security questions. Please try again.'
        this.isLoadingSubmit = false // set the isLoading variable to false
      } // end else
    },
    complete: () => {
      this.isLoadingSubmit = false // set the isLoading variable to false
    }
  })
}

}
