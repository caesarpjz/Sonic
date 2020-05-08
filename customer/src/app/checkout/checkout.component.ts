import { Router } from '@angular/router';
import { SharedService } from './../services/shared.service';
import { CustomerService } from './../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { RestaurantsService } from '../services/restaurants.service';
import { AlertService } from '../services/alert.service';

import Swal from 'sweetalert2';

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
  card = null;
  validCard = true;

  availableLocations = [];

  customAddress = 'customAddress';

  pointsOffset = 0;
  totalPoints = 0;
  newDeliveryFees = this.deliveryFee;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private restaurantService: RestaurantsService,
    private customerService: CustomerService,
    private sharedService: SharedService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.initCheckoutForm();
    this.cartService.initCart();
  }

  ngOnInit() {
    if (!sessionStorage.getItem('loggedIn')) {
      this.router.navigate(['/login']);
    }

    this.cartItems = this.cartService.retrieveCart();
    this.subtotal = this.cartService.calculateSubtotal();
    this.cartService.cartChanged.subscribe(cart => {
      this.cartItems = cart;
    });
    this.getRecentLocations();
    this.retrieveCreditCardInfo();
  }

  initCheckoutForm() {
    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      paymentOption: ['CASH', Validators.required],
      creditCardNumber: ['', [this.checkLimit(1000000000000000, 9999999999999999)]],
      expiryMonth: [''],
      expiryYear: [''],
      cvv: ['']
    });
  }

  getRecentLocations() {
    this.customerService.getLocations().subscribe((res) => {
      for (var i = 0; i < res.length; i++) {
        this.availableLocations.push({ 'label': res[i].getrecentlocations, 'value': res[i].getrecentlocations });
      }
    });
  }

  checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { 'range': true };
      }
      return null;
    };
  }

  get paymentOption() {
    return this.checkoutForm.get('paymentOption').value;
  }

  retrieveCreditCardInfo() {
    this.customerService.getProfile().subscribe((res) => {
      this.card = {
        'name': res[0].cc_name,
        'expiry': res[0].cc_expiry,
        'number': res[0].cc_num
      };

      this.totalPoints = res[0].points;
    }, (err) => {
      console.error(err);
    })
  }

  checkPointsOffsetValidity() {
    if (this.pointsOffset >= this.deliveryFee) {
      this.newDeliveryFees = 0;
    } else {
      this.newDeliveryFees = this.deliveryFee - this.pointsOffset;
    }
  }

  submit() {
    if (this.checkoutForm.value.paymentOption === 'CREDIT CARD') {
      // check if card is selected
      let valid = true;
      // this.card =

      if (this.card === null) {
        // check if values are valid
        const date = `${this.checkoutForm.value.expiryMonth}/${this.checkoutForm.value.expiryYear}`;

        if (this.checkoutForm.value.creditCardNumber.length < 16 ||
            isNaN(this.checkoutForm.value.creditCardNumber) ||
            (Number(this.checkoutForm.value.expiryYear) === 2020 && Number(this.checkoutForm.value.expiryMonth) < 6)) {
          valid = false;
          this.validCard = false;
        }

        this.card = {
          'cc_name': this.checkoutForm.value.name,
          'expiryDate': date,
          'num': this.checkoutForm.value.creditCardNumber
        };
      } else {
        this.card = {
          'cc_name': this.card.name,
          'expiryDate': this.card.expiry,
          'num': this.card.number
        }
      }

      if (valid) {
        this.customerService.addCard(this.card).subscribe((res) => {
          console.log(res);

          this.restaurantService.checkout(this.checkoutForm, this.cartItems).subscribe((res) => {
            Swal.fire({
              title: 'Your order has been placed',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/profile']);
                localStorage.removeItem('cart');
              }
            });

            console.log(res);

            // route to order summary page when complete, show delivery status blah
          }, ((err) => {
              Swal.fire({
                title: 'Your order has not been placed',
                icon: 'error',
                confirmButtonText: 'OK',
              });
          }));
        });
      } else {
        this.alertService.error('Invalid credit card information, please try again.');
      }

    } else {
      this.restaurantService.checkout(this.checkoutForm, this.cartItems).subscribe((res) => {
        Swal.fire({
          title: 'Your order has been placed',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['/profile']);
            localStorage.removeItem('cart');
          }
        });

        console.log(res);

        // route to order summary page when complete, show delivery status blah
      }, ((err) => {
        Swal.fire({
          title: 'Your order has not been placed',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }));
    }
  }
}
