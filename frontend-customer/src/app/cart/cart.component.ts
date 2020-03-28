import { Component, OnInit } from '@angular/core';
import { CartService } from './../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService]
})
export class CartComponent implements OnInit {
  cartItems: any;

  constructor(
    private cartService: CartService
  ) {
    this.cartService.initCart();
  }

  ngOnInit() {
    this.cartItems = this.cartService.retrieveCart();
    this.cartService.cartChanged.subscribe(cart => {
      this.cartItems = cart;
    });
  }

  increaseQuantity = (item) => {
    this.cartService.addQuantity(item);
  }

  decreaseQuantity = (item) => {
    this.cartService.decreaseQuantity(item);
  }

  remove = (item) => {
    this.cartService.removeFromCart(item);
  }

}
