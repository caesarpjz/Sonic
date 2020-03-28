import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class CartService {

  constructor() { }

  initCart() {
    if (localStorage.getItem('cart') == null) {
      localStorage.setItem('cart', '[]');
    }
    return JSON.parse(localStorage.getItem('cart'));
  }

  addToCart(item) {
    let cart = this.retrieveCart();
    // check if item exists in cart already
    // if it exists, then we add the quantity item
    console.log(cart);
    console.log(item);
    const index = this.indexOf(item, cart);
    console.log(index);

    if (index === -1) {
      item.quantity = 1;
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      alert('or here');
      this.addQuantity(item);
    }
  }

  removeFromCart() {

  }

  retrieveCart() {
    console.log(localStorage.getItem('cart'));
    return JSON.parse(localStorage.getItem('cart'));
  }

  /**
   * Increase quantity of existing item in cart
   * @param item
   */
  addQuantity(item) {
    let cart = this.retrieveCart();
    const index = this.indexOf(item, cart);

    cart[index].quantity++;
    console.log('cart', cart);

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  decreaseQuantity() {

  }

/**
 *
 * custom indexof function to search fr objects in an array
 * @params: item, the item to search
 * @params: arr, the array to search for the item
 * @returns: number. index of item if found, else -1 if not found
 */
  indexOf(item, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === item.id) {
        return i;
      }
    }

    return -1;
  }

}
