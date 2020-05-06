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
  newFood: Food;
  displayUpdate: boolean = false;
  displayAdd: boolean = false;
  foods: any;
  cols: any[];
  foodToView: any;
  menuId: any;
  restId: any;

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

  update(updateFoodForm: NgForm) {
    // let foodToUpdate:any = {
    //   "quantity" = foodToView
    // }

    this.foodItemsService.updateFood(this.restId, this.menuId, this.foodToView["fid"]).subscribe(
      response => {
        this.displayUpdate = false;
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
      }
    )
  }

  deleteFood(foodToDelete: Food) {
    const index: number = this.foods.indexOf(foodToDelete);
    this.foods.splice(index, 1);
    console.log(this.foods);
  }

  showDialog2() {
    this.displayAdd = true;
  }

  clear() {
    this.submitted = false;
    this.newFood = new Food();
  }

  addFood(addFoodForm: NgForm) {
    this.foods.push(this.newFood);
    this.displayAdd = false;
  }
}
