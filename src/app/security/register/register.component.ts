/*
======================================
; Title: register.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 20 September 2023
; Last Updated: 20 September 2023
; Description: This code supports the Register Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { RegisterViewModel } from '../signin/register-view-model';
import { Router } from '@angular/router';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // variables for the register component
  securityQuestions: string[]
  qArr1: string[]
  qArr2: string[]
  qArr3: string[]

  user: RegisterViewModel // user variable
  errorMessage: string // error message variable

  // registerForm group with form builder and validators
  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.compose([Validators.required])],
    lastName: ['', Validators.compose([Validators.required])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    question1: ['', Validators.compose([Validators.required])],
    question2: ['', Validators.compose([Validators.required])],
    question3: ['', Validators.compose([Validators.required])],
    answer1: ['', Validators.compose([Validators.required])],
    answer2: ['', Validators.compose([Validators.required])],
    answer3: ['', Validators.compose([Validators.required])],
    phoneNumber: ['', Validators.compose([Validators.required])],
    address: ['', Validators.compose([Validators.required])],

  })

  constructor(private router: Router, private fb: FormBuilder, private securityService: SecurityService) {
    // array of security questions
    this.securityQuestions = [
      "What is your mother's middle name?",
      "What is the name of your first pet?",
      "What is your favorite color?",
      "What is your favorite movie?",
      "What is your favorite fast food?",
      "What is your favorite song?"
    ]

    this.qArr1 = this.securityQuestions // init the first array of questions to the security questions array
    this.qArr2 = [] // init the 2nd array of questions to an empty array
    this.qArr3 = [] // init the 3rd array of questions to an empty array

    this.user = {} as RegisterViewModel // init the user to an empty object
    this.errorMessage = '' // init the error message to an empty string
  }

  ngOnInit(): void {
    // subscribe to the value changes of question 1
    this.registerForm.get('question1')?.valueChanges.subscribe(val => {
      console.log('Value changed from question 1', val)
      this.qArr2 = this.qArr1.filter(q => q !== val) // filter the first array of questions to remove the selected question
    })

    // subscribe to the value changes of question 2
    this.registerForm.get('question2')?.valueChanges.subscribe(val => {
      console.log('Value changed from question 2', val)
      this.qArr3 = this.qArr2.filter(q => q !== val) // filter the first array of questions to remove the selected question
  })

  }


}