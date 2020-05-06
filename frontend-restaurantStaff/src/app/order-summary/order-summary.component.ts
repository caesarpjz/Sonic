import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { OrdersService } from '../services/orders.service';
import { RestaurantService } from '../services/restaurant.service';
import { SessionService } from '../services/session.service';

interface Month {
  name: string,
}


@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {

  orders: any;
  months: Month[];
  selectedMonth: string;
  ordersForSelectedMonth: any = [];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private restaurantService: RestaurantService,
    private ordersService: OrdersService) {
      this.selectedMonth = null;
     }

  ngOnInit() {

    this.months = [
      {name: 'January'},
      {name: 'February'},
      {name: 'March'},
      {name: 'April'},
      {name: 'May'},
      {name: 'June'},
      {name: 'July'},
      {name: 'August'},
      {name: 'September'},
      {name: 'October'},
      {name: 'November'},
      {name: 'December'},
    ]
    console.log(this.selectedMonth);

    this.ordersService.getSummaryOrders().subscribe(
      response => {
        this.orders = response;
        console.log(response[0]["month"].substring(5,7))
        var i = 0;
        for (i=0; i < response.length; i++) {
          var monthNum = response[i]["month"].substring(5,7);
          if (monthNum == "01") {
            this.orders[i].month = "January";
          } else if (monthNum == "02") {
            this.orders[i].month = "February";
          } else if (monthNum == "03") {
            this.orders[i].month = "March";
          } else if (monthNum == "04") {
            this.orders[i].month = "April";
          } else if (monthNum == "05") {
            this.orders[i].month = "May";
          } else if (monthNum == "06") {
            this.orders[i].month = "June";
          } else if (monthNum == "07") {
            this.orders[i].month = "July";
          } else if (monthNum == "08") {
            this.orders[i].month = "August";
          } else if (monthNum == "09") {
            this.orders[i].month = "September";
          } else if (monthNum == "10") {
            this.orders[i].month = "October";
          } else if (monthNum == "11") {
            this.orders[i].month = "November";
          } else if (monthNum == "12") {
            this.orders[i].month = "December";
          }
        }
        console.log(this.orders.month)
      },
    )
  }

  chooseMonth() {
    var i = 0;
    console.log(this.orders.length)
    for (i=0; i < this.orders.length; i++) {
      if (this.orders[i].month == this.selectedMonth["name"]) {
        this.ordersForSelectedMonth.push(this.orders[i]);
      }
    }
  }

  goToTopFive() {
    this.router.navigate(['/view-topFive']);
  }

}
