import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantsService } from './../services/restaurants.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  restaurant: any;
  restaurantId: any;
  reviews: any;

  constructor(
    private restaurantService: RestaurantsService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('restaurantId');
    this.getRestaurant();
  }

  getRestaurant() {
    this.restaurantService.getRestaurant(this.restaurantId).subscribe((res) => {
      this.restaurant = res[0];
      this.retrieveReviews();
    });
  }

  retrieveReviews() {
    this.restaurantService.getReviews(this.restaurantId).subscribe((res) => {
      this.reviews = res;
    });
  }

  back() {
    this.router.navigate([`/restaurants/${this.restaurantId}`])
  }
}
