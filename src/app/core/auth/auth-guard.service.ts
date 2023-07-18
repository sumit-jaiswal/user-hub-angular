import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return of(false);
    }
    return of(isAuthenticated);
    /**
     * Need a server side API to validate token
     */
    // return this.authService.validateToken().pipe(
    //   switchMap((isValid: boolean) => {
    //     if (isValid) {
    //       // Token is valid, allow access
    //       return of(true);
    //     } else {
    //       // Token is invalid, redirect to login or appropriate page
    //       this.router.navigate(['/login']);
    //       return of(false);
    //     }
    //   })
    // );
  }
}
