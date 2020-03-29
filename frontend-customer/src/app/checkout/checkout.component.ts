import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from './../services/cart.service';

declare var stripe;
declare var elements;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [CartService]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any;
  subtotal: number;
  deliveryFee: number = 5;
  total: 0;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService
  ) {
    this.initCheckoutForm();
    this.cartService.initCart();
  }

  ngOnInit() {
    this.cartItems = this.cartService.retrieveCart();
    this.subtotal = this.cartService.calculateSubtotal();
    this.cartService.cartChanged.subscribe(cart => {
      this.cartItems = cart;
    });
  }

  initCheckoutForm() {
    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      creditCardNumber: ['', Validators.required],
      date: ['', Validators.required],
      cvv: ['', Validators.required]
    });
  }

  submit() {
    // user {}, cart {}
  }

}
