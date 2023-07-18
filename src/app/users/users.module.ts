import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { MaterialModule } from '../shared/material.module';
import { NgChartsModule } from 'ng2-charts';
import { UserReportComponent } from './user-report/user-report.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [UserListComponent, UserDetailsComponent, UserReportComponent, UserProfileComponent],
  imports: [CommonModule, UsersRoutingModule, MaterialModule, NgChartsModule],
})
export class UsersModule {}
