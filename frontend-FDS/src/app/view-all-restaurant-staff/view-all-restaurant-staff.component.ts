import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { RestaurantStaffService } from '../services/restaurant-staff.service';

@Component({
  selector: 'app-view-all-restaurant-staff',
  templateUrl: './view-all-restaurant-staff.component.html',
  styleUrls: ['./view-all-restaurant-staff.component.css']
})
export class ViewAllRestaurantStaffComponent implements OnInit {

  restId: any;
  restaurantStaffs: any;
  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  displayDelete: boolean = false;
  restaurantStaffToUpdate: any;
  restaurantStaffToDelete: any;
  newRestaurantStaff: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private restaurantStaffService: RestaurantStaffService) {
    this.newRestaurantStaff = {};
  }

  ngOnInit() {
    this.restId = this.activatedRoute.snapshot.paramMap.get('rest_id');

    this.restaurantStaffService.getRestaurantStaff(this.restId).subscribe(
      response => {
        this.restaurantStaffs = response;
      }
    )
  }

  showDialog3() {
    this.displayAdd = true;
  }

  deleteRestaurantStaff(restaurantStaffToDelete: any) {
    // console.log(promotionToDelete);
    this.restaurantStaffService.deleteRestaurantStaff(this.restId, restaurantStaffToDelete.rsid).subscribe(
      response => {
        this.restaurantStaffService.getRestaurantStaff(this.restId).subscribe(
          response => {
            this.restaurantStaffs = response;
          }
        )
      }
    )
  }

  addRestaurantStaff(addRestaurantStaffForm: NgForm) {
    // const { start_time, end_time, discount_desc, discount_percentage, name }
    // let menuName: string = this.newMenu["name"];
    // console.log(this.newPromotion);
    this.restaurantStaffService.createRestaurantStaff(this.restId, this.newRestaurantStaff).subscribe(
      response => {
        this.displayAdd = false;
        this.restaurantStaffService.getRestaurantStaff(this.restId).subscribe(
          response => {
            this.restaurantStaffs = response;
          }
        )
      }
    );
  }
}
