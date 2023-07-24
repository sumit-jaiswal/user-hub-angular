import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  users!: MatTableDataSource<User>;
  displayedColumns: string[] = ['id', 'name', 'email'];
  _hidePagination = false;
  pageSize!: number;
  pageIndex!: number;
  totalUsers!: number;
  isLoading$: Observable<boolean> = new BehaviorSubject(false);
  private ngUnsubscribe$ = new Subject();

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    private usersService: UsersService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initializePagination();
    this.getUsers();
  }

  ngAfterViewInit() {
    if (this.sort && this.users) this.users.sort = this.sort;
  }

  /**
   * Initializes the pagination settings (page size, current page index, total user count).
   */
  initializePagination() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.totalUsers = 0;
  }

  /**
 /**
   * @description Since the API does not return the total count in the pagination response,
   * we need to call the API twice during the initialization of the page.
   * One API call is made to retrieve the paginated data,
   * and another API call is made to retrieve all the user count.
   * This is a workaround due to the limitations of the mock API.
   * If the API provides the total count in the pagination response,
   * we can optimize the code to make a single API call.
   */
  getUsers(): void {
    this.loadingService.loadingOn();
    this.usersService
      .getUsers()
      .pipe(
        tap((users) => (this.totalUsers = users.length)),
        switchMap(() => this.getPaginationData())
      )
      .subscribe();
  }

  /**
   * Applies sorting to the retrieved user data and updates the MatTableDataSource.
   * @param users Array of User objects representing the users to be displayed in the table.
   */
  applySortingOnResponse(users: User[]) {
    this.users = new MatTableDataSource(users);
    if (this.sort) this.users.sort = this.sort;
  }

  /**
   * Fetches paginated user data based on the current pagination settings and filter value.
   * @param filter Optional filter string to search for specific users by name.
   * @returns An observable of paginated user data.
   */
  getPaginationData(filter?: string) {
    return this.usersService
      .getUsers(this.pageIndex, this.pageSize, filter)
      .pipe(
        tap((users) => this.applySortingOnResponse(users)),
        finalize(() => this.loadingService.loadingOff()),
        takeUntil(this.ngUnsubscribe$)
      );
  }

  /**
   * Handles page change events triggered by the Angular Material paginator.
   * Fetches new paginated user data and updates the table when the page changes.
   * @param event The PageEvent object containing the new page index and page size.
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadingService.loadingOn();
    this.getPaginationData().subscribe();
  }

  /**
   * Filters the users based on the provided input filter string.
   * Hides pagination and shows the filtered data in the table. (Since the API does not support filtering with search)
   * @param event The input event containing the filter value.
   */
  filterUsers(event: any) {
    if (!event || !event.target) return;

    // Cancel the previous API call
    this.cancelPreviousAPICall();

    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue) {
      this.hidePagination();
      this.loadingService.loadingOn();
      this.getPaginationData(filterValue).pipe(debounceTime(300)).subscribe();
    } else {
      this.clearFilterUsers();
    }
  }

  /**
   * Clears the filter and displays paginated data in the table from page 1.
   */
  clearFilterUsers() {
    this.loadingService.loadingOn();
    this.pageIndex = 0;
    this.displayPagination();
    this.getPaginationData().subscribe();
  }

  /**
   * Cancels the previous API call by unsubscribing from the current subject,
   * and creates a new subject for upcoming subscriptions.
   */
  cancelPreviousAPICall(): void {
    this.ngUnsubscribe$.next('');
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$ = new Subject();
  }

  /**
   * Hides pagination by setting the flag to true.
   */
  hidePagination() {
    this._hidePagination = true;
  }

  /**
   * Displays pagination by setting the flag to false.
   */
  displayPagination() {
    this._hidePagination = false;
  }

  /**
   * Clears the filter input by setting its value to an empty string.
   * Then, clears the filter and shows paginated data in the table.
   * @param inputElement The HTMLInputElement containing the filter value.
   */
  cleanFilterInput(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.clearFilterUsers();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next('');
    this.ngUnsubscribe$.complete();
  }
}
