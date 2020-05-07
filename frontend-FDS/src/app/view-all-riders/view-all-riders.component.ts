import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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
      }
    )
  }

}
