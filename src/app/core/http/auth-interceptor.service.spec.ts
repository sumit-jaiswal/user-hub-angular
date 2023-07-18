import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth-interceptor.service';
import { SocialAuthServiceConfigMock } from 'src/app/testing/social-auth.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthInterceptor', () => {
  let service: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthInterceptor, SocialAuthServiceConfigMock],
    });
    service = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
