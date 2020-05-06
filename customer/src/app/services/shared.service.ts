import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private loggedIn = false;
  private username = '';
  private restaurant: any;
  private card = null;

  constructor() { }

  toggleCard(card) {
    if (this.card === null) {
      this.card = card;
    } else {
      this.card = null;
    }
  }

  getCard() {
    return this.card;
  }

  toggleLoggedIn() {
    if (!this.loggedIn) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  getLoggedInStatus() {
    return this.loggedIn;
  }

  setUsername(username) {
    this.username = username;
  }

  getUsername() {
    return this.username;
  }

  setRestaurant(restaurant) {
    this.restaurant = restaurant;
  }

  getRestaurant() {
    return this.restaurant;
  }
}
