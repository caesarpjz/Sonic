import { Component, OnInit } from '@angular/core';

import { SessionService } from '../services/session.service';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  username: string;
  display1: boolean = false;
  display2: boolean = false;
  display3: boolean = false;
  display4: boolean = false;
  display5: boolean = false;
  monthCustomerReports: any;
  eachCustomerReports: any;
  hourlyLocationReports: any;
  locationReportOverviews: any;
  riderReportOverviews: any;

  constructor(
    private sessionService: SessionService,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    this.username = this.sessionService.getUsername();
  }

  showDialog1() {
    this.display1 = true;

    this.reportService.generateMonthCustomerReport().subscribe(
      response => {
        console.log(response);
        this.monthCustomerReports = response;
        // console.log(this.monthCustomerReport);
        // console.log(this.monthCustomerReport.total_cost)
      }
    )
  }

  showDialog2() {
    this.display2 = true;

    this.reportService.getEachCustomerReport().subscribe(
      response => {
        console.log(response);
        this.eachCustomerReports = response;
      }
    )
  }

  showDialog3() {
    this.display3 = true;

    this.reportService.getHourlyLocationReport().subscribe(
      response => {
        this.hourlyLocationReports = response;
      }
    )
  }

  showDialog4() {
    this.display4 = true;

    this.reportService.getLocationReportOverview().subscribe(
      response => {
        this.locationReportOverviews = response;
      }
    )
  }

  showDialog5() {
    this.display5 = true;

    this.reportService.getRiderReportOverview().subscribe(
      response => {
        this.riderReportOverviews = response;
      }
    )
  }

}
