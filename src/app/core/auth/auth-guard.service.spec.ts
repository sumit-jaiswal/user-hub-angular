import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { AuthGuard } from './auth-guard.service';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SocialLoginModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [AuthGuard, AuthService, SocialAuthServiceConfigMock],
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow access and setLoginUser when user is authenticated and token is valid', (done) => {
    const mockUser = {
      provider: '',
      id: '',
      email: 'test@user.com',
      name: 'test user',
      photoUrl: '',
      picture: '',
      firstName: '',
      lastName: '',
      authToken: '',
      idToken: '',
      authorizationCode: '',
      response: '',
    };
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    spyOn(authService, 'validateToken').and.returnValue(
      of({ payload: mockUser })
    );
    spyOn(authService, 'setLoginUser');
    spyOn(authService, 'logout');
    spyOn(console, 'error');

    authGuard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
      expect(authService.setLoginUser).toHaveBeenCalledWith(mockUser);
      expect(authService.logout).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      done();
    });
  });

  it('should navigate to /login and return false when user is not authenticated', (done) => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    spyOn(router, 'navigate');
    spyOn(authService, 'validateToken');
    spyOn(authService, 'setLoginUser');
    spyOn(authService, 'logout');
    spyOn(console, 'error');

    authGuard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(authService.validateToken).not.toHaveBeenCalled();
      expect(authService.setLoginUser).not.toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      done();
    });
  });

  it('should logout and return false if payload is undefined', (done) => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    spyOn(authService, 'validateToken').and.returnValue(
      of({ payload: undefined })
    );
    spyOn(authService, 'logout');

    authGuard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
      expect(authService.logout).toHaveBeenCalled();
      done();
    });
  });
});
