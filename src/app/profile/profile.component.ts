/*
======================================
; Title: profile.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 28 September 2023
; Last Updated: 30 September 2023
; Description: This code supports the Profile Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileViewModel } from '../profile-view-model';
import { UserService } from '../admin/users/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProfileSuccessComponent } from '../dialogs/profile-success/profile-success.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  email: string // define the email variable
  profile: ProfileViewModel // define the profile variable

  // establish form group and make validators
  profileForm: FormGroup = this.fb.group({
    phoneNumber: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9-]*$")])],
    firstName: ['', Validators.compose([Validators.required])],
    lastName: ['', Validators.compose([Validators.required])],
    address: ['', Validators.compose([Validators.required])],
  })

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private fb: FormBuilder, private matDialog: MatDialog) {
    this.profile = {} as ProfileViewModel // init profile variable
    this.profileForm.disable(); // disable the form to start

    // pull the email address from the route
    let l_email = this.route.snapshot.paramMap.get('email') || ''

    this.email = l_email;

    console.log(this.email)

    // populates the form fields with the profile datga
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

  // toggles the form to enable
  editEnabled() {
    this.profileForm.enable();
  }

  // the function that updates the profile
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
        this.openProfileSuccessDialog();
      },
      error: (err) => {
        console.error(err) // log the error to the console
      }
    })
  }
  // refreshes the page to show the new info
  pageRefresh() {
    location.reload()
  }

  // opens the success dialog
  openProfileSuccessDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    this.matDialog.open(ProfileSuccessComponent, dialogConfig);
  }

}
