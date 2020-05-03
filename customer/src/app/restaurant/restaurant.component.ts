import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
  providers: [CartService]
})
export class RestaurantComponent implements OnInit {
  products: any; // todos: change to product[]
  state$: Observable<object>;
  restaurant: any;

  constructor(
    private cartService: CartService,
    public activatedRoute: ActivatedRoute
  ) {
    this.cartService.initCart();
  }

  ngOnInit() {
    // test data
    this.products = [
      { id: 1, name: 'Chicken chop', menu: 'Mains', quantity: 0, price: 6 },
      { id: 2, name: 'Spaggheti', menu: 'Mains', quantity: 0, price: 10 }
    ];

    this.state$ = this.activatedRoute.paramMap
      .pipe((() => window.history.state.data));

      // replace with retrieveRestaurantById if possible

    console.log(this.state$);
  }

  addToCart = (item) => {
    this.cartService.addToCart(item);
  }

  addQuantity(item) {
    this.cartService.addQuantity(item);
  }

}
