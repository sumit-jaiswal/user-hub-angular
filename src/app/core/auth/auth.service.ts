import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * AuthService
 *
 * This service handles authentication-related functionalities, including login, logout,
 * token management, and checking the authentication status. It interacts with the
 * `@abacritt/angularx-social-login` library to handle social logins and stores the
 * login state using BehaviorSubject. It also provides methods to refresh and validate
 * tokens with the backend auth server. The service is provided at the root level to ensure
 * a singleton instance throughout the application.
 */
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
    this.subscribeToAuthStateChanges();
    this.checkAuthenticationStatus();
  }

  private subscribeToAuthStateChanges(): void {
    this.authService.authState.subscribe((user) => {
      this.setLoginUser(user);
      if (user) {
        this.login(user.idToken);
      }
    });
  }

  private checkAuthenticationStatus(): void {
    if (this.isAuthenticated()) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  setLoginUser(user: SocialUser) {
    this.loginUserSubject.next(user);
  }

  //log in the user with a token and update the authentication status
  login(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  // log out the user, clear the token, and navigate to the login page
  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  // check if the user is authenticated based on the presence of a token
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
  // get the stored token from local storage
  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // validate the user's token with the backend server
  public validateToken(): Observable<any> {
    const token = encodeURIComponent(this.getToken());
    return this.http.post<any>(`${environment.auth_uri}validate-token`, {
      token,
    });
  }
}
