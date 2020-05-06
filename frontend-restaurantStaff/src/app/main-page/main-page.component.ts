import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  restaurant: any;
  displayUpdate: boolean = false;
  restaurantToUpdate: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private restaurantService: RestaurantService) { }

  ngOnInit() {

    this.restaurantService.getRestaurant().subscribe(
      response => {
        this.restaurant = response;
      }
    )
  }

  showDialog() {
    this.displayUpdate = true;
    this.restaurantToUpdate = this.restaurant;
  }

  updateInfo(updateRestaurantForm: NgForm) {

    let restaurantToUpdate: any = {
      "name": this.restaurantToUpdate.name,
      "min_spending": this.restaurantToUpdate.min_spending,
      "category": this.restaurantToUpdate.category,
      "info": this.restaurantToUpdate.info
    }
    this.restaurantService.updateInfo(this.restaurant.rest_id, restaurantToUpdate).subscribe(
      response => {

      },
    );
  }
}
