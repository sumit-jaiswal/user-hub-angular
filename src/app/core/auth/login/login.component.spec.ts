import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';
import { MaterialModule } from 'src/app/shared/material.module';
import {
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let socialAuthService: jasmine.SpyObj<SocialAuthService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        SocialLoginModule,
        GoogleSigninButtonModule,
        HttpClientTestingModule,
        MaterialModule,
      ],
      providers: [
        HttpClientTestingModule,
        AuthService,
        SocialAuthServiceConfigMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    socialAuthService = TestBed.inject(
      SocialAuthService
    ) as jasmine.SpyObj<SocialAuthService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /users when user is logged in via social authentication', () => {
    const routingSpy = spyOn(router, 'navigate');
    const user = { idToken: 'some-id-token' };
    authService.login(user.idToken);
    component.checkIsLogin();
    expect(routingSpy).toHaveBeenCalledWith(['/users']);
  });

  it('should navigate to /users when user is logged in via regular authentication', () => {
    const routingSpy = spyOn(router, 'navigate');
    const user = { idToken: 'some-id-token' };
    authService.login(user.idToken);

    component.checkIsLogin();
    expect(routingSpy).toHaveBeenCalledWith(['/users']);
  });

  it('should navigate to /users when user is already authenticated', () => {
    const routingSpy = spyOn(router, 'navigate');
    spyOn(authService, 'isAuthenticated').and.returnValue(true);

    component.checkIsLogin();
    expect(routingSpy).toHaveBeenCalledWith(['/users']);
  });
});
