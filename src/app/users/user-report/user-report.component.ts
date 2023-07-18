import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
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
    this.barChartData.labels = users
      .map((user) => DateUtil.getYear(user.createdAt))
      .filter((value, index, self) => self.indexOf(value) === index);

    let activeUser = [];
    let inactiveUser = [];

    users.map(() => {});

    this.barChartData.datasets.push({
      data: [15],
      label: 'Active user',
    });

    this.barChartData.datasets.push({
      data: [6],
      label: 'Inactive user',
    });

    this.chart?.update();
  }
}
