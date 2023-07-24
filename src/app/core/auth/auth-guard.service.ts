import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * AuthGuard
 *
 * This is a route guard that implements the CanActivate interface and is used
 * to protect certain routes from unauthorized access. It checks if the user is
 * authenticated using the `AuthService.isAuthenticated` method. If the user is
 * not authenticated, it navigates to the '/login' route and returns `false`.
 * If the user is authenticated, it then calls the `AuthService.validateToken`
 * method to check if the user's token is still valid. If the token is valid,
 * it allows access to the protected route and returns `true`. Otherwise, it
 * logs out the user and returns `false`.
 */
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
    // If the error status is 401 (Unauthorized), log out the user
    if (error.status == 401) {
      this.authService.logout();
    }
    return throwError('Something went wrong. Please try again later.');
  };
}
