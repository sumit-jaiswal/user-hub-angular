import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { of } from 'rxjs';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let authService: AuthService;
  let socialAuthService: SocialAuthService;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        SocialAuthService,
        SocialAuthServiceConfigMock,
        Router,
      ],
    });

    authService = TestBed.inject(AuthService);
    socialAuthService = TestBed.inject(SocialAuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should update loginUserSubject with the provided user', () => {
    const nextSpy = spyOn(authService['loginUserSubject'], 'next');
    const sampleUser = {
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
    authService.setLoginUser(sampleUser);
    expect(nextSpy).toHaveBeenCalledWith(sampleUser);
  });

  it('should set login user and isAuthenticatedSubject when login is called', () => {
    spyOn(localStorage, 'setItem');
    spyOn(authService['isAuthenticatedSubject'], 'next');

    const mockToken = 'mock_token';
    authService.login(mockToken);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(authService['isAuthenticatedSubject'].next).toHaveBeenCalledWith(
      true
    );
  });

  it('should remove token, sign out, and navigate to login page when logout is called', () => {
    spyOn(localStorage, 'removeItem');
    spyOn(authService['isAuthenticatedSubject'], 'next');
    spyOn(authService['authService'], 'signOut');
    spyOn(router, 'navigate');

    authService.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(authService['isAuthenticatedSubject'].next).toHaveBeenCalledWith(
      false
    );
    expect(authService['authService'].signOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return true if token exists in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock_token');

    const result = authService.isAuthenticated();

    expect(result).toBe(true);
  });

  it('should return false if token does not exist in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = authService.isAuthenticated();

    expect(result).toBe(false);
  });

  it('should return token from localStorage when getToken is called', () => {
    const mockToken = 'mock_token';
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);

    const result = authService.getToken();

    expect(result).toBe(mockToken);
  });

  it('should make a POST request to validate the token', () => {
    const mockToken = 'mock_token';
    spyOn(authService, 'getToken').and.returnValue(mockToken);

    authService.validateToken().subscribe();

    const req = httpMock.expectOne(`${environment.auth_uri}validate-token`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: mockToken });
  });
});
