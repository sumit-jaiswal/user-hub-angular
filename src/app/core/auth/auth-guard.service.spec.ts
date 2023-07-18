import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [SocialLoginModule, HttpClientTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        SocialAuthServiceConfigMock,
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true and not navigate if user is authenticated', () => {
    // Arrange
    authService.isAuthenticated.and.returnValue(true);

    // Act
    const canActivate = guard.canActivate();

    // Assert
    canActivate.subscribe((result) => {
      expect(result).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  it('should return false and navigate to login if user is not authenticated', () => {
    // Arrange
    authService.isAuthenticated.and.returnValue(false);

    // Act
    const canActivate = guard.canActivate();

    // Assert
    canActivate.subscribe((result) => {
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
