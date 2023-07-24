import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { UsersService } from 'src/app/shared/services/users.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersServiceMock } from 'src/app/testing/users-service.mock';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Subject, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let usersService: UsersService;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      providers: [{ provide: UsersService, useClass: UsersServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize pagination settings', () => {
      component.initializePagination();
      expect(component.pageSize).toBe(10);
      expect(component.pageIndex).toBe(0);
      expect(component.totalUsers).toBe(0);
    });

    it('should call getUsers', () => {
      spyOn(component, 'getUsers').and.callThrough();
      spyOn(loadingService, 'loadingOn');

      component.getUsers();
      expect(component.getUsers).toHaveBeenCalled();
      expect(loadingService.loadingOn).toHaveBeenCalled();
    });
  });

  describe('getPaginationData', () => {
    it('should call getUsers from UsersService and set users in MatTableDataSource', (done) => {
      spyOn(usersService, 'getUsers').and.callThrough();
      spyOn(component, 'applySortingOnResponse');
      spyOn(loadingService, 'loadingOff');

      const filterValue = 'John';
      component.getPaginationData(filterValue).subscribe((users) => {
        expect(usersService.getUsers).toHaveBeenCalledWith(
          component.pageIndex,
          component.pageSize,
          filterValue
        );
        expect(component.applySortingOnResponse).toHaveBeenCalledWith(users);
        done();
      });
    });
  });

  describe('onPageChange', () => {
    it('should update pageIndex and pageSize properties', () => {
      const event: PageEvent = { pageIndex: 2, pageSize: 10, length: 50 };
      component.onPageChange(event);

      expect(component.pageIndex).toBe(2);
      expect(component.pageSize).toBe(10);
    });

    it('should call loadingOn method of loadingService', () => {
      spyOn(loadingService, 'loadingOn');
      const event: PageEvent = { pageIndex: 0, pageSize: 5, length: 20 };
      component.onPageChange(event);

      expect(loadingService.loadingOn).toHaveBeenCalled();
    });
  });

  describe('filterUsers', () => {
    beforeEach(() => {
      spyOn(loadingService, 'loadingOn');
      spyOn(component, 'getPaginationData').and.returnValue(of([]));
    });
    it('should do nothing when event or event.target is not provided', () => {
      const event: any = null;
      component.filterUsers(event);
      expect(component.getPaginationData).not.toHaveBeenCalled();
      expect(loadingService.loadingOn).not.toHaveBeenCalled();
    });
    it('should cancel previous API call and call loadingOn when a non-empty filter value is provided', () => {
      const inputValue = 'example filter';
      const event: any = { target: { value: inputValue } };

      component.filterUsers(event);

      expect(component.getPaginationData).toHaveBeenCalledWith(
        inputValue.toLowerCase()
      );
      expect(loadingService.loadingOn).toHaveBeenCalled();
    });

    it('should debounce the API call by 300ms', (done: DoneFn) => {
      const debounceTimeValue = 300;

      const event: any = { target: { value: 'sample filter' } };
      component.filterUsers(event);

      expect(component.getPaginationData).toHaveBeenCalledWith('sample filter');

      // Wait for the debounce time plus a little buffer (50ms) before checking the getPaginationData call count.
      setTimeout(() => {
        expect(component.getPaginationData).toHaveBeenCalledTimes(1);
        done();
      }, debounceTimeValue + 50);
    });
    it('should call clearFilterUsers when an empty filter value is provided', () => {
      const event: any = { target: { value: '' } };
      spyOn(component, 'clearFilterUsers');

      component.filterUsers(event);

      expect(component.clearFilterUsers).toHaveBeenCalled();
    });
  });
  describe('clearFilterUsers', () => {
    it('should call loadingOn method of loadingService', () => {
      spyOn(loadingService, 'loadingOn');
      component.clearFilterUsers();

      expect(loadingService.loadingOn).toHaveBeenCalled();
    });
    it('should set pageIndex to 0', () => {
      component.pageIndex = 5; // Set pageIndex to a non-zero value.
      component.clearFilterUsers();

      expect(component.pageIndex).toBe(0);
    });

    it('should call displayPagination method', () => {
      spyOn(component, 'displayPagination');
      component.clearFilterUsers();

      expect(component.displayPagination).toHaveBeenCalled();
    });

    it('should call getPaginationData', () => {
      const mockObservable = of(/* mock API response */);
      spyOn(component, 'getPaginationData').and.returnValue(of([]));

      component.clearFilterUsers();
      expect(component.getPaginationData).toHaveBeenCalled();
    });
  });

  describe('cancelPreviousAPICall', () => {
    it('should call next and complete on ngUnsubscribe$', () => {
      const nextSpy = spyOn(component['ngUnsubscribe$'], 'next');
      const completeSpy = spyOn(component['ngUnsubscribe$'], 'complete');

      component.cancelPreviousAPICall();

      expect(nextSpy).toHaveBeenCalledWith('');
      expect(completeSpy).toHaveBeenCalled();
    });
    it('should assign a new instance of Subject to ngUnsubscribe$', () => {
      const previousSubject = component['ngUnsubscribe$'];

      component.cancelPreviousAPICall();

      expect(component['ngUnsubscribe$']).not.toBe(previousSubject);
      expect(component['ngUnsubscribe$'] instanceof Subject).toBeTrue();
    });
  });

  it('should set _hidePagination to true in hidePagination()', () => {
    component.hidePagination();
    expect(component._hidePagination).toBeTrue();
  });

  it('should set _hidePagination to false in displayPagination()', () => {
    component.displayPagination();
    expect(component._hidePagination).toBeFalse();
  });

  describe('clearFilterUsers', () => {
    it('should clear the input field value and call clearFilterUsers', () => {
      const inputElement = document.createElement('input') as HTMLInputElement;
      inputElement.value = 'Sample Filter';

      spyOn(component, 'clearFilterUsers');

      component.cleanFilterInput(inputElement);

      expect(inputElement.value).toBe('');

      expect(component.clearFilterUsers).toHaveBeenCalled();
    });
  });

  it('should call next and complete on ngUnsubscribe$', () => {
    spyOn(component['ngUnsubscribe$'], 'next');
    spyOn(component['ngUnsubscribe$'], 'complete');

    component.ngOnDestroy();

    expect(component['ngUnsubscribe$'].next).toHaveBeenCalledWith('');
    expect(component['ngUnsubscribe$'].complete).toHaveBeenCalled();
  });
});
