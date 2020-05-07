import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

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
  restId: any;
  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  displayDelete: boolean = false;
  displaySummary: boolean = false;
  promotionToUpdate: any;
  promotionToDelete: any;
  promotionSummary: any;
  newPromotion: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private promotionsService: PromotionsService,
    private restaurantService: RestaurantService) {
    this.newPromotion = {};
  }

  ngOnInit() {

    this.restaurantService.getRestaurant().subscribe(
      response => {
        this.restId = response.rest_id;
        this.promotionsService.getPromotions(this.restId).subscribe(
          response => {
            this.promotions = response;
            var i = 0;
            for (i = 0; i < this.promotions.length; i++) {
              var subStringStartDate = moment(this.promotions[i].start_date).format('DD-MM-YYYY');
              console.log(subStringStartDate);
              this.promotions[i].start_date = subStringStartDate;
              var subStringEndDate = moment(this.promotions[i].end_date).format('DD-MM-YYYY');
              this.promotions[i].end_date = subStringEndDate;
            }
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

  showDialog3() {
    this.displayAdd = true;
  }

  showDialog2(promotionSummary: any) {
    this.displaySummary = true;
    this.promotionSummary = promotionSummary;
    this.promotionsService.viewPromotionSummary(promotionSummary.pid).subscribe(
      response => {
        console.log(response)
        this.promotionSummary = response[0];
      }
    )
  }

  deletePromotion(promotionToDelete: any) {
    this.promotionsService.deletePromotion(this.restId, promotionToDelete.pid).subscribe(
      response => {
        this.promotionsService.getPromotions(this.restId).subscribe(
          response => {
            this.promotions = response;
          }
        )
      }
    )
  }

  update(updatePromotionForm: NgForm) {
    console.log(this.promotionToUpdate);
    this.promotionsService.updatePromotion(this.restId, this.promotionToUpdate.pid, this.promotionToUpdate).subscribe(
      response => {
        this.displayUpdate = false;
        this.promotionsService.getPromotions(this.restId).subscribe(
          response => {
            this.promotions = response;
          }
        )
      }
    )
  }

  addPromotion(addPromotionForm: NgForm) {
    // const { start_time, end_time, discount_desc, discount_percentage, name }
    // let menuName: string = this.newMenu["name"];
    console.log(this.newPromotion);
    this.promotionsService.createPromotion(this.restId, this.newPromotion).subscribe(
      response => {
        this.displayAdd = false;
        this.promotionsService.getPromotions(this.restId).subscribe(
          response => {
            this.promotions = response;
          }
        )
      }
    );
  }
}
