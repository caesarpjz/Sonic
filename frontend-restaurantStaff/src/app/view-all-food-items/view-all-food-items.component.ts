import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Food } from '../classes/food';

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
  foods: Food[] = [];
  cols: any[];
  foodToView: Food;

  constructor() {
    this.submitted = false;
    this.newFood = new Food();
  }

  ngOnInit() {
    let food1: Food;
    food1 = new Food(1, "Hamburger", "Western", 25.00, 10, 1);

    let food2: Food;
    food2 = new Food(2, "Cheese Fries", "Western", 5.00, 15, 1);

    let food3: Food;
    food3 = new Food(3, "Potato Wedges", "Western", 8.00, 10, 2);

    this.foods.push(food1);
    this.foods.push(food2);
    this.foods.push(food3);
  }

  showDialog1(foodToView: Food) {
    this.displayUpdate = true;
    this.foodToView = foodToView;
  }

  update(updateFoodForm: NgForm) {
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
