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
          this.loginUserSubject.next(user);
          return user;
        })
      );
  }

  public validateToken(): Observable<any> {
    const token = encodeURIComponent(this.getToken());
    return this.http.post<any>(`${environment.auth_uri}validate-token`, {
      token,
    });
  }
}
