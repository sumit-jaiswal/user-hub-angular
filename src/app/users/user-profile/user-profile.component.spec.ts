import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { UsersModule } from '../users.module';
import { AuthService } from 'src/app/core/auth/auth.service';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersModule, SocialLoginModule, HttpClientTestingModule],
      providers: [AuthService, SocialAuthServiceConfigMock],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
