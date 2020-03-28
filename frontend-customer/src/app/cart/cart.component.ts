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
  subtotal: number;

  constructor(
    private cartService: CartService
  ) {
    this.cartService.initCart();
  }

  ngOnInit() {
    this.cartItems = this.cartService.retrieveCart();
    this.subtotal = this.cartService.calculateSubtotal();
    this.cartService.cartChanged.subscribe(cart => {
      this.cartItems = cart;
    });
  }

  increaseQuantity = (item) => {
    this.cartService.addQuantity(item);
    this.subtotal = this.cartService.calculateSubtotal();
  }

  decreaseQuantity = (item) => {
    this.cartService.decreaseQuantity(item);
    this.subtotal = this.cartService.calculateSubtotal();
  }

  remove = (item) => {
    this.cartService.removeFromCart(item);
    this.subtotal = this.cartService.calculateSubtotal();
  }



}
