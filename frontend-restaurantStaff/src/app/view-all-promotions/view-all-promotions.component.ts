import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { SessionService } from '../services/session.service';
import { PromotionsService } from '../services/promotions.service';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-view-all-promotions',
  templateUrl: './view-all-promotions.component.html',
  styleUrls: ['./view-all-promotions.component.css']
})
export class ViewAllPromotionsComponent implements OnInit {

  promotions: any;
  restId : any;
  displayUpdate: boolean = false;
  promotionToUpdate: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private promotionsService: PromotionsService,
    private restaurantService: RestaurantService) { }

  ngOnInit() {

    this.restaurantService.getRestaurant().subscribe(
      response => {
        this.restId = response.rest_id;
        this.promotionsService.getPromotions(this.restId).subscribe(
          response => {
            this.promotions = response;
          }
        )
      },
      error => {
        console.log('********** GetRestaurantComponent.ts: ' + error);
      }
    )
  }

  showDialog1(promotionToUpdate: any) {
    this.displayUpdate = true;
    this.promotionToUpdate = promotionToUpdate;
  }

  update(updatePromotionForm: NgForm) {
    this.promotionsService.updatePromotion(this.restId, promotionToUpdate.pid, this.promotionToUpdate).subscribe(
      response => {
      }
    )
  }
}
