import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RestaurantsService } from '../services/restaurants.service';

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
    private cartService: CartService,
    private restaurantService: RestaurantsService
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

    console.log(this.cartItems);
  }

  initCheckoutForm() {
    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      paymentOption: ['CASH', Validators.required],
      creditCardNumber: [''],
      date: [''],
      cvv: ['']
    });
  }

  get paymentOption() {
    return this.checkoutForm.get('paymentOption').value;
  }

  submit() {
    this.restaurantService.checkout(this.checkoutForm, this.cartItems).subscribe((res) => {
      console.log(res);

      // route to order summary page when complete, show delivery status blah
    });

    // if option credit, also need to set credit card num?
  }

}
