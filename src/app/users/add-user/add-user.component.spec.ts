import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserComponent } from './add-user.component';
import { UsersModule } from '../users.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthInterceptor } from 'src/app/core/http/auth-interceptor.service';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [AuthInterceptor, SocialAuthServiceConfigMock],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
