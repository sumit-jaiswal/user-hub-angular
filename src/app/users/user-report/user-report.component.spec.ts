import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserReportComponent } from './user-report.component';
import { UsersService } from 'src/app/shared/services/users.service';
import { of } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/material.module';
import { NgChartsModule } from 'ng2-charts';

describe('UserReportComponent', () => {
  let component: UserReportComponent;
  let fixture: ComponentFixture<UserReportComponent>;
  let usersService: UsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialModule, NgChartsModule],
      declarations: [UserReportComponent],
      providers: [UsersService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should prepare chart data correctly', () => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        avatar: 'avatar_url',
        status: true,
        email: 'john@example.com',
        createdAt: '2022-01-01T00:00:00',
      },
      {
        id: 2,
        name: 'Jane Doe',
        avatar: 'avatar_url',
        status: false,
        email: 'jane@example.com',
        createdAt: '2022-02-01T00:00:00',
      },
    ];

    spyOn(usersService, 'getUsers').and.returnValue(of(mockUsers));
    spyOn(component, 'prepareChartData').and.callThrough();

    component.getUsers();

    expect(usersService.getUsers).toHaveBeenCalled();

    expect(component.prepareChartData).toHaveBeenCalledWith(mockUsers);

    expect(component.barChartData.labels).toEqual(['2022']);
    expect(component.barChartData.datasets.length).toBe(2);
    expect(component.barChartData.datasets[0].label).toBe('Inactive user');
    expect(component.barChartData.datasets[0].data).toEqual([1]);
    expect(component.barChartData.datasets[1].label).toBe('Active user');
    expect(component.barChartData.datasets[1].data).toEqual([1]);
  });
});
