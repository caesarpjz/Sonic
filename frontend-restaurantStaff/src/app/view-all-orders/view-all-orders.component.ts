import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { OrdersService } from '../services/orders.service';
import { RestaurantService } from '../services/restaurant.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-view-all-orders',
  templateUrl: './view-all-orders.component.html',
  styleUrls: ['./view-all-orders.component.css']
})
export class ViewAllOrdersComponent implements OnInit {

  orders: any;
  restId: any;
  orderArray = [];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private restaurantService: RestaurantService,
    private ordersService: OrdersService) { }

  ngOnInit() {

    this.restaurantService.getRestaurant().subscribe(
      response => {
        console.log(response.rest_id);
        this.restId = response.rest_id;
        this.ordersService.getOrders(this.restId).subscribe(
          response => {
            this.orders = response;
          },
          error => {
            console.log('********** GetAllMenusComponent.ts: ' + error);
          }
        )
      },
      error => {
        console.log('********** GetRestaurantComponent.ts: ' + error);
      }
    )
  }

  goToSummaryPage() {
    this.router.navigate(['/view-order-summary']);
  }

}
