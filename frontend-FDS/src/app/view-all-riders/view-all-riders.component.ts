import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

import { RidersService } from '../services/riders.service';  

@Component({
  selector: 'app-view-all-riders',
  templateUrl: './view-all-riders.component.html',
  styleUrls: ['./view-all-riders.component.css']
})
export class ViewAllRidersComponent implements OnInit {

  riders: any;
  display: boolean = false;
  shifts: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private ridersService: RidersService) { }

  ngOnInit() {
    this.ridersService.getRiders().subscribe(
      response => {
        this.riders = response;
      }
    )
  }

  showDialog1(rider: any) {
    this.display = true;
    this.ridersService.getRiderShift(rider.rid).subscribe(
      response => {
        this.shifts = response;
        var i = 0;
        for (i = 0; i < this.shifts.length; i++) {
          var subStringStartDate = moment(this.shifts[i].start_time).format('DD-MM-YYYY HH:mm');
          this.shifts[i].start_time = subStringStartDate;
          var subStringEndDate = moment(this.shifts[i].end_time).format('DD-MM-YYYY HH:mm');
          this.shifts[i].end_time = subStringEndDate;
        }
      }
    )
  }

}
