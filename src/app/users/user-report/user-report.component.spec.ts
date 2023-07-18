import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportComponent } from './user-report.component';
import { UsersService } from 'src/app/shared/services/users.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/material.module';
import { NgChartsModule } from 'ng2-charts';

describe('UserRepotComponent', () => {
  let component: UserReportComponent;
  let fixture: ComponentFixture<UserReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialModule, NgChartsModule],
      declarations: [UserReportComponent],
      providers: [UsersService],
    }).compileComponents();

    fixture = TestBed.createComponent(UserReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
