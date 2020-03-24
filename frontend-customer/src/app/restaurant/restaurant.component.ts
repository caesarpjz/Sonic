import { Product } from './../models/product';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  products: Product[];

  constructor() { }

  ngOnInit() {
    // test data
    this.products = [
      { id: 1, name: 'Chicken chop' },
      { id: 2, name: 'Spaggheti' }
    ];
  }

}
