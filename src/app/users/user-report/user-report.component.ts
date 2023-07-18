import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { UsersService } from 'src/app/shared/services/users.service';
import { User } from 'src/app/shared/models/user.model';
import { DateUtil } from 'src/app/shared/utils/date.util';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss'],
})
export class UserReportComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.prepareChartData(users);
    });
  }

  prepareChartData(users: User[]) {
    const userCountsByYear: any = users.reduce((result: any, user) => {
      const year = DateUtil.getYear(user.createdAt);
      result[year] = result[year] || { active: 0, inactive: 0 };
      if (user.status) {
        result[year].active += 1;
      } else {
        result[year].inactive += 1;
      }
      return result;
    }, {});

    console.log(userCountsByYear);
    const uniqueYears = Object.keys(userCountsByYear)
      .sort()
      .filter((value, index, self) => self.indexOf(value) === index);

    const activeUserCounts = uniqueYears.map(
      (year) => userCountsByYear[year].active
    );
    const inactiveUserCounts = uniqueYears.map(
      (year) => userCountsByYear[year].inactive
    );
    this.barChartData.labels = uniqueYears;

    this.barChartData.datasets.push({
      data: inactiveUserCounts,
      label: 'Inactive user',
    });
    this.barChartData.datasets.push({
      data: activeUserCounts,
      label: 'Active user',
    });

    this.chart?.update();
  }
}
