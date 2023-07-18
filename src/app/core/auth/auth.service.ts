import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  public loginUserSubject: BehaviorSubject<SocialUser> =
    new BehaviorSubject<SocialUser>(new SocialUser());
  public loginUser$: Observable<SocialUser> =
    this.loginUserSubject.asObservable();

  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.authService.authState.subscribe((user) => {
      console.log('user', user);
      this.loginUserSubject.next(user);
      if (user) this.login(user?.idToken);
    });
    // On Page refresh
    if (this.isAuthenticated()) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  refreshToken() {
    const encodedIdToken = encodeURIComponent(this.getToken());
    return this.http
      .get<any>(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodedIdToken}`
      )
      .pipe(
        map((user) => {
          console.log(user);
          this.loginUserSubject.next(user);
          return user;
        })
      );
  }

  // Method to validate the token
  public validateToken(): Observable<boolean> {
    const encodedIdToken = encodeURIComponent(this.getToken());
    return this.http.get<boolean>(
      `${environment.auth_uri}?id_token=${encodedIdToken}`
    );
  }
}
