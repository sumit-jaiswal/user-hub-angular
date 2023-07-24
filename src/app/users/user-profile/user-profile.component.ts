import { SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';

/**
 * UserProfileComponent
 *
 * This component represents the user profile page, displaying the user's profile information.
 * It uses the 'AuthService' to get the currently logged-in user's information from the 'loginUser$' observable.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  loginUser$: Observable<SocialUser> | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginUser$ = this.authService.loginUser$;
  }
}
