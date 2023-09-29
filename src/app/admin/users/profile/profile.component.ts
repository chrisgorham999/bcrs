/*
======================================
; Title: profile.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 28 September 2023
; Last Updated: 29 September 2023
; Description: This code supports the Profile Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileViewModel } from '../profile-view-model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  successMessage: string
  email: string // define the email variable
  profile: ProfileViewModel // define the profile variable

  profileForm: FormGroup = this.fb.group({
    phoneNumber: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9-]*$")])],
    firstName: ['', Validators.compose([Validators.required])],
    lastName: ['', Validators.compose([Validators.required])],
    address: ['', Validators.compose([Validators.required])],
  })

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.profile = {} as ProfileViewModel
    this.successMessage = '';
    this.profileForm.disable();

    let l_email = this.route.snapshot.paramMap.get('email') || ''

    this.email = l_email;

    console.log(this.email)

    this.userService.getUser(this.email).subscribe({
      next: (profile: any) => {
        this.profile = profile
        console.log(this.profile)
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
        this.profileForm.controls['phoneNumber'].setValue(this.profile.phoneNumber),
        this.profileForm.controls['address'].setValue(this.profile.address)
        this.profileForm.controls['firstName'].setValue(this.profile.firstName)
        this.profileForm.controls['lastName'].setValue(this.profile.lastName)
      }
    })

  }

  editEnabled() {
    this.profileForm.enable();
  }

  updateProfile() {
    let profile = {} as ProfileViewModel // init the profile view model

    // assign values from the form to the profile model
    profile.firstName = this.profileForm.controls['firstName'].value
    profile.lastName = this.profileForm.controls['lastName'].value
    profile.address = this.profileForm.controls['address'].value
    profile.phoneNumber = this.profileForm.controls['phoneNumber'].value

    console.log('Profile View Model: ', profile) // for troubleshooting purposes

    // call the userService updateProfile()
    this.userService.updateProfile(this.email, profile).subscribe({
      next: (res) => {
        console.log(res)
        this.profileForm.disable();
        alert('Profile Updated Successfully!')
        this.pageRefresh();
      },
      error: (err) => {
        console.error(err) // log the error to the console
      }
    })
  }

  pageRefresh() {
    location.reload()
  }

}
