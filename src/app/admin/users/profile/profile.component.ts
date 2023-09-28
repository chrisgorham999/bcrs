import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileViewModel } from '../profile-view-model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  email: string // define the email variable
  profile: ProfileViewModel // define the profile variable

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {
    this.profile = {} as ProfileViewModel

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
      }
    })

  }

}
