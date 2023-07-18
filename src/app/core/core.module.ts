import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './theme/header/header.component';
import { NotFoundComponent } from './theme/not-found/not-found.component';
import { FooterComponent } from './theme/footer/footer.component';
import { MaterialModule } from '../shared/material.module';
import { LoginComponent } from './auth/login/login.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    GoogleSigninButtonModule,
    RouterModule,
  ],
  declarations: [
    HeaderComponent,
    NotFoundComponent,
    FooterComponent,
    LoginComponent,
  ],
  exports: [
    HeaderComponent,
    NotFoundComponent,
    FooterComponent,
    LoginComponent,
  ],
})
export class CoreModule {}
