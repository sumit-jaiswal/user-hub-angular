import { SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';

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
