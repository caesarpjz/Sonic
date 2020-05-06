import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { SessionService } from '../services/session.service';
import { RestaurantService } from '../services/restaurant.service';
import { ReviewsService } from '../services/reviews.service';

@Component({
  selector: 'app-view-all-reviews',
  templateUrl: './view-all-reviews.component.html',
  styleUrls: ['./view-all-reviews.component.css']
})
export class ViewAllReviewsComponent implements OnInit {

  reviews: any;
  restId: any

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute, 
    private sessionService: SessionService,
    private restaurantService: RestaurantService,
    private reviewsService: ReviewsService) { }

  ngOnInit() {

    this.restaurantService.getRestaurant().subscribe(
      response => {
        console.log(response.rest_id);
        this.restId = response.rest_id;
        this.reviewsService.getReviews(this.restId).subscribe(
          response => {
            console.log(response.length)
            this.reviews = response;
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

}
