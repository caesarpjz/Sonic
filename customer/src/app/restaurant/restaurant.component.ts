import { SharedService } from './../services/shared.service';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantsService } from '../services/restaurants.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
  providers: [CartService]
})
export class RestaurantComponent implements OnInit {
  products: any;
  restaurant: any;
  restaurantId: any;
  menus: any;

  constructor(
    private cartService: CartService,
    private restaurantService: RestaurantsService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.cartService.initCart();
  }

  ngOnInit() {
    this.restaurantId = this.route.snapshot.paramMap.get('restaurantId');
    this.getRestaurant();
  }

  getRestaurant() {
    this.restaurantService.getRestaurant(this.restaurantId).subscribe((res) => {
      this.restaurant = res[0];
      this.getMenus();
    });
  }

  getMenus() {
    this.restaurantService.getRestaurantMenus(this.restaurantId).subscribe((res) => {
      this.menus = res;
      this.getFoods();
    });
  }

  // populate the menus with foods
  getFoods() {
    for (var i = 0; i < this.menus.length; i++) {
      this.restaurantService.getRestaurantMenuFoodItems(this.restaurantId, this.menus[i].menu_id).subscribe((res) => {
        if (res.length > 0) {
          for (var j = 0; j < this.menus.length; j++) {
            if (this.menus[j].menu_id === res[0].menu_id) {
              this.menus[j].foods = res;
            }
          }
        }
      });
    }
  }

  addToCart = (item) => {
    this.cartService.addToCart(item);
    this.sharedService.setRestaurant(this.restaurant);
    console.log(this.sharedService.getRestaurant())
  }

  addQuantity(item) {
    this.cartService.addQuantity(item);
  }

}
