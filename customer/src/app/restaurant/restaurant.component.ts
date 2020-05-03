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
  products: any; // todos: change to product[]
  restaurant: any;

  constructor(
    private cartService: CartService,
    private restaurantService: RestaurantsService,
    private route: ActivatedRoute
  ) {
    this.cartService.initCart();
  }

  ngOnInit() {
    // test data
    this.products = [
      { id: 1, name: 'Chicken chop', menu: 'Mains', quantity: 0, price: 6 },
      { id: 2, name: 'Spaggheti', menu: 'Mains', quantity: 0, price: 10 }
    ];

    this.getRestaurant();
  }

  getRestaurant() {
    this.restaurantService.getRestaurant(this.route.snapshot.paramMap.get('restaurantId')).subscribe((res) => {
      this.restaurant = res[0];
    });
  }

  addToCart = (item) => {
    this.cartService.addToCart(item);
  }

  addQuantity(item) {
    this.cartService.addQuantity(item);
  }

}
