import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../services/restaurants.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants = [];

  constructor(private restaurantService: RestaurantsService, private router: Router) {
    this.getRestaurants();
  }

  ngOnInit() {
  }

  getRestaurants() {
    this.restaurantService.getRestaurants().subscribe((res) => {
      this.restaurants = res;
    }, (err) => {
      console.error(err);
    });
  }

  goToRestaurant() {
  }

}
