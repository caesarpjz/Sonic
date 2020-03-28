import { CartService } from './../services/cart.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu-food-card',
  templateUrl: './menu-food-card.component.html',
  styleUrls: ['./menu-food-card.component.css'],
  providers: [CartService]

})
export class MenuFoodCardComponent implements OnInit {
  @Input() foodName: string;
  @Input() food: string;
  @Input() addToCart: (food) => {};

  constructor() { }

  ngOnInit() {
  }

  addItemToCart(food) {
    console.log(this);
    // this.addToCart(food);
  }
}
