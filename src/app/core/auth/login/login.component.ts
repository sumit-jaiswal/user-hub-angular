import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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

  ngOnInit() {
    this.checkIsLogin();
  }

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

  onLoginSuccess() {
    this.router.navigate(['/users']);
  }
}
