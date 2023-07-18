import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, SocialAuthService, SocialAuthServiceConfigMock],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login and set isAuthenticatedSubject to true', () => {
    spyOn(service['isAuthenticatedSubject'], 'next');
    spyOn(localStorage, 'setItem');

    const token = 'sampleToken';
    service.login(token);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
    expect(service['isAuthenticatedSubject'].next).toHaveBeenCalledWith(true);
  });

  it('should return true when token is present', () => {
    spyOn(localStorage, 'getItem').and.returnValue('sampleToken');

    const result = service.isAuthenticated();

    expect(result).toBe(true);
  });

  it('should return false when token is not present', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = service.isAuthenticated();

    expect(result).toBe(false);
  });

  it('should return the token from localStorage', () => {
    const token = 'sampleToken';
    spyOn(localStorage, 'getItem').and.returnValue(token);

    const result = service.getToken();

    expect(result).toBe(token);
  });

  it('should call the validateToken API and return the response', () => {
    const dummyResponse = true;

    service.validateToken().subscribe((result) => {
      expect(result).toBe(dummyResponse);
    });

    const req = httpMock.expectOne(
      `${environment.auth_uri}?id_token=${encodeURIComponent(
        service.getToken()
      )}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
