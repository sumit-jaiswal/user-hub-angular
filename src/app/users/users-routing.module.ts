import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserReportComponent } from './user-report/user-report.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AddUserComponent } from './add-user/add-user.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'add', component: AddUserComponent },
  { path: 'report', component: UserReportComponent },
  { path: 'profile', component: UserProfileComponent }, //should move to other module,which will manage profile related data.
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
