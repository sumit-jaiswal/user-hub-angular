import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * AuthInterceptor
 *
 * This is an HTTP interceptor that adds an Authorization header with the user's token
 * to each outgoing HTTP request. The interceptor gets the user's token from the
 * 'AuthService' and attaches it to the 'Authorization' header as a Bearer token.
 * This ensures that the user's authentication token is included with each request,
 * allowing the backend server to identify and authenticate the user.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authReq);
  }
}
