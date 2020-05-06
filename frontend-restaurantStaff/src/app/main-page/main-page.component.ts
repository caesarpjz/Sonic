import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  restaurantName: String;
  restaurantAddress: String;

  constructor() { }

  ngOnInit() {
    this.restaurantName = "Food King Bar";
    this.restaurantAddress = "Ang Mo Kio Avenue 10"
  }

}
