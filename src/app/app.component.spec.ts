import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { CoreModule } from './core/core.module';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { SocialAuthServiceConfigMock } from './testing/social-auth.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MaterialModule,
        CoreModule,
        SocialLoginModule,
        HttpClientTestingModule,
      ],
      declarations: [AppComponent],
      providers: [SocialAuthServiceConfigMock],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
