import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Food } from '../classes/food';
import { FoodItemsService } from '../services/food-items.service';
import { RestaurantService } from '../services/restaurant.service';


@Component({
  selector: 'app-view-all-food-items',
  templateUrl: './view-all-food-items.component.html',
  styleUrls: ['./view-all-food-items.component.css'],
})
export class ViewAllFoodItemsComponent implements OnInit {

  submitted: boolean;
  newFood: any;
  displayUpdate: boolean = false;
  displayAdd: boolean = false;
  foods: any;
  cols: any[];
  foodToView: any;
  menuId: any;
  restId: any;
  isAvailable: boolean = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private foodItemsService: FoodItemsService,
    private restaurantService: RestaurantService) {
    this.submitted = false;
    this.newFood = new Food();
  }

  ngOnInit() {
    this.menuId = this.activatedRoute.snapshot.paramMap.get('menuId');
    console.log(typeof this.menuId);

    this.restaurantService.getRestaurant().subscribe(
      response => {
        console.log(response.rest_id);
        this.restId = response.rest_id;
        this.foodItemsService.getFoodItems(this.restId, this.menuId).subscribe(
          response => {
            this.foods = response;
          },
          error => {
            console.log('********** GetRestaurantComponent.ts: ' + error);
          }
        )
      },
      error => {
        console.log('********** GetRestaurantComponent.ts: ' + error);
      }
    )
  }

  showDialog1(foodToView: Food) {
    this.displayUpdate = true;
    this.foodToView = foodToView;
  }

  updateFood(updateFoodForm: NgForm) {
    // let foodToUpdate:any = {
    //   "quantity" = foodToView
    // }

    console.log(this.foodToView);

    let foodToUpdate: any = {
      "quantity" : this.foodToView.quantity,
      "daily_limit" : this.foodToView.daily_limit,
      "name" : this.foodToView.name,
      "price" : this.foodToView.price,
      "availability" : true
    }

    console.log(foodToUpdate);
    let fid: any = this.foodToView.fid;

    this.foodItemsService.updateFood(this.restId, this.menuId, fid, foodToUpdate).subscribe(
      response => {
        this.displayUpdate = false;
      },
      error => {
        console.log('********** GetRestaurantComponent.ts: ' + error);
      }
    );
  }

  deleteFood(foodToDelete: any) {
    this.foodItemsService.deleteFood(this.restId, this.menuId, foodToDelete.fid).subscribe(
      response => {
      },
      error => {
        console.log('********** GetRestaurantComponent.ts: ' + error);
      }
    );
  }

  showDialog2() {
    this.displayAdd = true;
  }

  clear() {
    this.submitted = false;
    this.newFood = new Food();
  }

  addFood(addFoodForm: NgForm) {
    
    let foodToCreate: any = {
      "quantity": this.newFood.quantity,
      "daily_limit": this.newFood.daily_limit,
      "name": this.newFood.name,
      "price": this.newFood.price,
      "category": this.newFood.category,
    }
    this.foodItemsService.createFood(this.restId, this.menuId, foodToCreate).subscribe(
      response => {
        this.displayAdd = false;
      }
    )
  }
}
