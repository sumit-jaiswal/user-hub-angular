import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../auth/auth.service';
import {
  GoogleSigninButtonModule,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { MaterialModule } from 'src/app/shared/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GoogleSigninButtonModule,
        MaterialModule,
        SocialLoginModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [HeaderComponent],
      providers: [AuthService, SocialAuthServiceConfigMock],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout when logOut is invoked', () => {
    spyOn(authService, 'logout');
    component.logOut();
    expect(authService.logout).toHaveBeenCalled();
  });
});
