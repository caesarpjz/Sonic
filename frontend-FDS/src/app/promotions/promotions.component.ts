import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { PromotionsService } from '../services/promotions.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {

  promotions: any;
  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  displayDelete: boolean = false;
  promotionToUpdate: any;
  promotionToDelete: any;
  newPromotion: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private promotionsService: PromotionsService, ) {
    this.newPromotion = {};
  }

  ngOnInit() {
    this.promotionsService.getPromotions().subscribe(
      response => {
        this.promotions = response;
        console.log(this.promotions)
        var i = 0;
        for (i = 0; i < this.promotions.length; i++) {
          // var subStringDate =
        }
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

  deletePromotion(promotionToDelete: any) {
    console.log(promotionToDelete);
    this.promotionsService.deletePromotion(promotionToDelete.pid).subscribe(
      response => {
        this.displayDelete = false;
        this.promotionsService.getPromotions().subscribe(
          response => {
            this.promotions = response;
          }
        )
      }
    )
  }

  update(updatePromotionForm: NgForm) {
    console.log(this.promotionToUpdate);
    this.promotionsService.updatePromotion(this.promotionToUpdate.pid, this.promotionToUpdate).subscribe(
      response => {
        this.displayUpdate = false;
        this.promotionsService.getPromotions().subscribe(
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
    this.promotionsService.createPromotion(this.newPromotion).subscribe(
      response => {
        this.displayAdd = false;
        this.promotionsService.getPromotions().subscribe(
          response => {
            this.promotions = response;
          }
        )
      }
    );
  }

}
