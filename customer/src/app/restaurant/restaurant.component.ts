import { CartService } from '../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantsService } from '../services/restaurants.service';
import Swal from 'sweetalert2';

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
    private router: Router
  ) {
    this.cartService.initCart();
  }

  ngOnInit() {
    this.restaurantId = this.route.snapshot.paramMap.get('restaurantId');
    this.getRestaurant();
  }

  goToReviews() {
    this.router.navigate([`/restaurants/${this.restaurantId}/reviews`]);
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
    if (localStorage.getItem('restaurantLastOrdered') &&
        JSON.parse(localStorage.getItem('restaurantLastOrdered')).rest_id !== Number(this.restaurantId)) {
      // alert that cart will be cleared if continue, otherwise cancel action
      Swal.fire({
        title: 'There are already items in your cart from another restaurant!',
        text: 'Do you want to continue? If so, your items from the other restaurant will be cleared',
        icon: 'error',
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
      }).then((result) => {
        if (result.value) {
          localStorage.setItem('restaurantLastOrdered', JSON.stringify(this.restaurant));
          localStorage.removeItem('cart');
          this.cartService.initCart();
          this.cartService.addToCart(item);
        }
      })
    } else {
      this.cartService.addToCart(item);
      localStorage.setItem('restaurantLastOrdered', JSON.stringify(this.restaurant));

      Swal.fire({
        title: item.name + ' added to cart!',
        icon: 'success',
        confirmButtonText: 'Go to cart',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/cart']);
        }
      });
    }
  }

  addQuantity(item) {
    this.cartService.addQuantity(item);
  }

}
