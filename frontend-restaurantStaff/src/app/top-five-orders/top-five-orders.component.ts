import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { OrdersService } from '../services/orders.service';
import { RestaurantService } from '../services/restaurant.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-top-five-orders',
  templateUrl: './top-five-orders.component.html',
  styleUrls: ['./top-five-orders.component.css']
})
export class TopFiveOrdersComponent implements OnInit {

  orders: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private restaurantService: RestaurantService,
    private ordersService: OrdersService) {
  }

  ngOnInit() {

    this.ordersService.getTopFive().subscribe(
      response => {
        this.orders = response;
      }
    )
  }

}
