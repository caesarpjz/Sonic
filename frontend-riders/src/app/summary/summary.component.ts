import { SummaryService } from './../services/summary.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  monthlySummary = null;
  month = null;

  constructor(private summaryService: SummaryService) { }

  ngOnInit(): void {
    this.getMonthlySummary();
  }

  getMonthlySummary() {
    this.summaryService.getMonthlySummary().subscribe((res) => {
      console.log(res);

      this.month = moment(res.month).format('MMMM');
      this.monthlySummary = res;
    });
  }

}
