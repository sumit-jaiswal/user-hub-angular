import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import {
  GoogleSigninButtonModule,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { MaterialModule } from 'src/app/shared/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        SocialLoginModule,
        GoogleSigninButtonModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [LoginComponent],
      providers: [AuthService, SocialAuthServiceConfigMock],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "/users" when onLoginSuccess is called', () => {
    let navigateSpy = spyOn(component['router'], 'navigate');
    component.onLoginSuccess();
    expect(navigateSpy).toHaveBeenCalledWith(['/users']);
  });

  it('should call onLoginSuccess when authService.isAuthenticated() returns true', () => {
    let navigateSpy = spyOn(component['router'], 'navigate');
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['/users']);
  });

  it('should call onLoginSuccess when authService.isAuthenticated$ returns true', () => {
    let navigateSpy = spyOn(component['router'], 'navigate');
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    authService['checkAuthenticationStatus']();
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['/users']);
  });
});
