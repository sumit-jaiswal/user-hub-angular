import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * Login Component
 *
 * This component provides a login functionality for users using the SocialAuthService
 * from '@abacritt/angularx-social-login' to authenticate with google sso.
 * It also utilizes the AuthService to handle the authentication state and navigation
 * to the '/users' route upon successful login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Calls the checkIsLogin method to handle the login logic.
   */
  ngOnInit() {
    this.checkIsLogin();
  }

  /**
   * Checks if the user is already authenticated and redirects to '/users'
   * if they are. It subscribes to the authState from the SocialAuthService
   * and the isAuthenticated$ from the AuthService to detect successful logins
   * and automatically navigate to the '/users' route.
   */
  checkIsLogin() {
    this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) this.onLoginSuccess();
    });

    this.authService.isAuthenticated$.subscribe((isLogin) => {
      if (isLogin) this.onLoginSuccess();
    });

    if (this.authService.isAuthenticated()) {
      this.onLoginSuccess();
    }
  }

  /**
   * Handles the navigation to the '/users' route upon successful login.
   * Called when the user is successfully authenticated via SocialAuthService
   * or AuthService.
   */
  onLoginSuccess() {
    this.router.navigate(['/users']);
  }
}
