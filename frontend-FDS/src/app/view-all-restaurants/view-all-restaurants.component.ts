import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { RestaurantService } from '../services/restaurant.service';

interface Category {
  category: any;
}

@Component({
  selector: 'app-view-all-restaurants',
  templateUrl: './view-all-restaurants.component.html',
  styleUrls: ['./view-all-restaurants.component.css']
})
export class ViewAllRestaurantsComponent implements OnInit {

  restaurants: any;
  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  displayDelete: boolean = false;
  restaurantToUpdate: any;
  restaurantToDelete: any;
  newRestaurant: any;

  categories: Category[];
  selectedCategory: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private restaurantService: RestaurantService) {
    this.newRestaurant = {};
  }

  ngOnInit() {

    this.categories = [
      { category: 'Western' },
      { category: 'Thai' },
      { category: 'Italian' },
      { category: 'Indian' },
    ]

    this.restaurantService.getRestaurants().subscribe(
      response => {
        this.restaurants = response;
      }
    )
  }

  showDialog1(restaurantToUpdate: any) {
    this.displayUpdate = true;
    this.restaurantToUpdate = restaurantToUpdate;
  }

  showDialog3() {
    this.displayAdd = true;
  }

  deletePromotion(restaurantToDelete: any) {
    // console.log(promotionToDelete);
    this.restaurantService.deleteRestaurant(restaurantToDelete.rest_id).subscribe(
      response => {
        this.restaurantService.getRestaurants().subscribe(
          response => {
            this.restaurants = response;
          }
        )
      }
    )
  }

  update(updateRestaurantForm: NgForm) {
    if (this.selectedCategory.category == 'Western') {
      this.restaurantToUpdate.category = this.selectedCategory.category;
    } else if (this.selectedCategory.category == "Thai") {
      this.restaurantToUpdate.category = this.selectedCategory.category;
    } else if (this.selectedCategory.category == "Indian") {
      this.restaurantToUpdate.category = this.selectedCategory.category;
    } else if (this.selectedCategory.category == "Italian") {
      this.restaurantToUpdate.category = this.selectedCategory.category;
    }
    console.log(this.restaurantToUpdate);
    this.restaurantService.updateRestaurant(this.restaurantToUpdate.rest_id, this.restaurantToUpdate).subscribe(
      response => {
        this.displayUpdate = false;
        this.restaurantService.getRestaurants().subscribe(
          response => {
            this.restaurants = response;
          }
        )
      }
    )
  }

  addRestaurant(addRestaurantForm: NgForm) {
    // const { start_time, end_time, discount_desc, discount_percentage, name }
    // let menuName: string = this.newMenu["name"];
    // console.log(this.newPromotion);
    console.log(this.selectedCategory.category);
    if (this.selectedCategory.category == 'Western') {
      this.newRestaurant.category = this.selectedCategory.category;
    } else if (this.selectedCategory.category == "Thai") {
      this.newRestaurant.category = this.selectedCategory.category;
    } else if (this.selectedCategory.category == "Indian") {
      this.newRestaurant.category = this.selectedCategory.category;
    } else if (this.selectedCategory.category == "Italian") {
      this.newRestaurant.category = this.selectedCategory.category;
    }
    console.log(this.newRestaurant.category);
    this.restaurantService.createRestaurant(this.newRestaurant).subscribe(
      response => {
        this.displayAdd = false;
        this.restaurantService.getRestaurants().subscribe(
          response => {
            this.restaurants = response;
          }
        )
      }
    );
  }

  goToRestaurantStaff(restaurant: any) {
    this.router.navigate(['/view-all-restaurantStaff/' + restaurant.rest_id]);
  }

}
