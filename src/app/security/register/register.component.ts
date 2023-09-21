/*
======================================
; Title: register.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 20 September 2023
; Last Updated: 21 September 2023
; Description: This code supports the Register Component
; Sources Used: Bellevue University WEB-450 Coding Sessions
;=====================================
*/

// imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { RegisterViewModel } from '../register-view-model';
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
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'
        ),
      ]),
    ],

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

  // register function that takes in no parameters and returns nothing
  // this function registers a new user and navigates to the signin page
  register() {
    // set the user object to the values of the register form
    this.user = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      address: this.registerForm.get('address')?.value,
      role: "standard",
      isDisabled: false,
      phoneNumber: this.registerForm.get('phoneNumber')?.value,
      selectedSecurityQuestions: [
        {
          question: this.registerForm.get('question1')?.value,
          answer: this.registerForm.get('answer1')?.value
        },
        {
          question: this.registerForm.get('question2')?.value,
          answer: this.registerForm.get('answer2')?.value
        },
        {
          question: this.registerForm.get('question3')?.value,
          answer: this.registerForm.get('answer3')?.value
        }
      ]

    }

    console.log('Registering new user', this.user) // log the user object to the console

    //call the register function from the security service and subscribe to the result
    this.securityService.register(this.user).subscribe({
      next: (result) => {
        console.log('Result from Register API Call: ', result) // log the result to the console
        this.router.navigate(['/security/signin']) // navigate to the sign in page
      },
      error: (err) => {
        if (err.error.message) {
          console.log('db error: ', err.error.message) // log the error message to the console
          this.errorMessage = err.error.message // set the error message to the error message from the API
        } else {
          this.errorMessage = 'Something went wrong. Please contact the system administrator.'
          console.log(err)
        }
      }
    })
  }


}