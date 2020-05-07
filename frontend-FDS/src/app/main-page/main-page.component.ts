import { Component, OnInit } from '@angular/core';

import { SessionService } from '../services/session.service';
import { ReportService } from '../services/report.service';
import * as moment from 'moment';

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
        var i = 0;
        for (i = 0; i < response.length; i++) {
          var monthNum = this.eachCustomerReports[i].start_of_month.substring(5, 7);
          if (monthNum == "01") {
            this.eachCustomerReports[i].start_of_month = "January";
          } else if (monthNum == "02") {
            this.eachCustomerReports[i].start_of_month = "February";
          } else if (monthNum == "03") {
            this.eachCustomerReports[i].start_of_month = "March";
          } else if (monthNum == "04") {
            this.eachCustomerReports[i].start_of_month = "April";
          } else if (monthNum == "05") {
            this.eachCustomerReports[i].start_of_month = "May";
          } else if (monthNum == "06") {
            this.eachCustomerReports[i].start_of_month = "June";
          } else if (monthNum == "07") {
            this.eachCustomerReports[i].start_of_month = "July";
          } else if (monthNum == "08") {
            this.eachCustomerReports[i].start_of_month = "August";
          } else if (monthNum == "09") {
            this.eachCustomerReports[i].start_of_month = "September";
          } else if (monthNum == "10") {
            this.eachCustomerReports[i].start_of_month = "October";
          } else if (monthNum == "11") {
            this.eachCustomerReports[i].start_of_month = "November";
          } else if (monthNum == "12") {
            this.eachCustomerReports[i].start_of_month = "December";
          }
        }
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
        var i = 0;
        for (i=0; i < response.length; i++) {
          var time = moment(this.locationReportOverviews[i].start_of_hour).format('DD-MM-YYYY HH:mm');
          this.locationReportOverviews[i].start_of_hour = time;
        }
      }
    )
  }

  showDialog5() {
    this.display5 = true;

    this.reportService.getRiderReportOverview().subscribe(
      response => {
        this.riderReportOverviews = response;
        var i = 0;
        for (i = 0; i < response.length; i++) {
          var monthNum = this.riderReportOverviews[i].start_of_month.substring(5, 7);
          if (monthNum == "01") {
            this.riderReportOverviews[i].start_of_month = "January";
          } else if (monthNum == "02") {
            this.riderReportOverviews[i].start_of_month = "February";
          } else if (monthNum == "03") {
            this.riderReportOverviews[i].start_of_month = "March";
          } else if (monthNum == "04") {
            this.riderReportOverviews[i].start_of_month = "April";
          } else if (monthNum == "05") {
            this.riderReportOverviews[i].start_of_month = "May";
          } else if (monthNum == "06") {
            this.riderReportOverviews[i].start_of_month = "June";
          } else if (monthNum == "07") {
            this.riderReportOverviews[i].start_of_month = "July";
          } else if (monthNum == "08") {
            this.riderReportOverviews[i].start_of_month = "August";
          } else if (monthNum == "09") {
            this.riderReportOverviews[i].start_of_month = "September";
          } else if (monthNum == "10") {
            this.riderReportOverviews[i].start_of_month = "October";
          } else if (monthNum == "11") {
            this.riderReportOverviews[i].start_of_month = "November";
          } else if (monthNum == "12") {
            this.riderReportOverviews[i].start_of_month = "December";
          }
        }
      }
    )
  }

}
