import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.authService.validateToken().pipe(
      switchMap((user) => {
        if (user && user.payload) {
          this.authService.setLoginUser(user.payload);
          return of(true);
        } else {
          this.authService.logout();
          return of(false);
        }
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)) // Use arrow function to preserve 'this' context
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('An error occurred:', error);
    if (error.status == 401) {
      this.authService.logout();
    }
    return throwError('Something went wrong. Please try again later.');
  };
}
