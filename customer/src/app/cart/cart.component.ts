import { SharedService } from './../services/shared.service';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService]
})
export class CartComponent implements OnInit {
  cartItems: any;
  subtotal: number;
  deliveryFee: number = 5;
  total: 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private alertService: AlertService,
    private sharedService: SharedService
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

  submit() {
    // check for min spending whether cost (food cost + delivery) hits
    const rest = this.sharedService.getRestaurant();
    console.log(rest);
    const minSpending = rest.min_spending;
    if ((this.subtotal + this.deliveryFee) >= minSpending) {
      this.router.navigate(['/checkout']);
    } else {
      this.alertService.error(`Need to hit total cost of ${minSpending} to place order`);
    }
  }
}
