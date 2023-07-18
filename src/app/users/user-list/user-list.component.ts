import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, switchMap, tap } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit {
  users: MatTableDataSource<User> | undefined;
  displayedColumns: string[] = ['id', 'name', 'email'];
  pageSize: number = 10;
  pageIndex: number = 0;
  totalUsers: number = 0;

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit() {
    if (this.sort && this.users) this.users.sort = this.sort;
  }

  /**
   * Since the API does not return the total count in the pagination response,
   * we need to call the API twice during the initialization of the page. One API call is made to retrieve the paginated data,
   * and another API call is made to retrieve all the user count. This is a workaround due to the limitations of the mock API.
   * If the API provides the total count in the pagination response, we can optimize the code to make a single API call.
   */
  getUsers(): void {
    this.usersService
      .getUsers()
      .pipe(
        tap((users) => (this.totalUsers = users.length)),
        switchMap(() => this.getPaginationData())
      )
      .subscribe((users) => {
        this.users = new MatTableDataSource(users);
        if (this.sort) this.users.sort = this.sort;
      });
  }

  getPaginationData() {
    let users$ = this.usersService.getUsers(this.pageIndex, this.pageSize);
    users$.subscribe((users) => {
      this.users = new MatTableDataSource(users);
      if (this.sort) this.users.sort = this.sort;
    });
    return users$;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPaginationData();
  }
}
