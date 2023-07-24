import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserComponent } from './add-user.component';
import { UsersModule } from '../users.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthInterceptor } from 'src/app/core/http/auth-interceptor.service';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from 'src/app/shared/services/users.service';
import { of } from 'rxjs';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let usersService: UsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [AuthInterceptor, SocialAuthServiceConfigMock],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should set isFailed to false when addUser call succeeds', () => {
      const mockUserFormValue = {
        username: 'testUser',
        password: 'testPassword',
      };

      component.userForm = {
        value: mockUserFormValue,
      } as any;

      spyOn(usersService, 'addUser').and.returnValue(of());

      component.onSubmit();

      expect(component.isFailed).toBe(false);
    });
  });
});
