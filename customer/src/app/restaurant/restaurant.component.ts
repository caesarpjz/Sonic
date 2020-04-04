import { CartService } from '../services/cart.service';
import { Product } from '../models/product';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
  providers: [CartService]
})
export class RestaurantComponent implements OnInit {
  products: any; // todos: change to product[]

  constructor(
    private cartService: CartService
  ) {
    this.cartService.initCart();
  }

  ngOnInit() {
    // test data
    this.products = [
      { id: 1, name: 'Chicken chop', menu: 'Mains', quantity: 0, price: 6 },
      { id: 2, name: 'Spaggheti', menu: 'Mains', quantity: 0, price: 10 }
    ];
  }

  addToCart = (item) => {
    this.cartService.addToCart(item);
  }

  addQuantity(item) {
    this.cartService.addQuantity(item);
  }

}
