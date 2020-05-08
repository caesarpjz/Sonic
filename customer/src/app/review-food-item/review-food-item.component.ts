import { AlertService } from './../services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from './../services/review.service';
import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-food-item',
  templateUrl: './review-food-item.component.html',
  styleUrls: ['./review-food-item.component.css']
})
export class ReviewFoodItemComponent implements OnInit {
  @Input() food;
  @Input() oid;

  reviewForm: FormGroup;

  constructor(private reviewService: ReviewService,
  private formBuilder: FormBuilder,
  private alertService: AlertService) { }

  ngOnInit(): void {
    this.initReviewForm();
  }

  initReviewForm() {
    this.reviewForm = this.formBuilder.group({
      review: ['', Validators.required]
    });
  }

  submitReview() {
    let review = this.reviewForm.value.review;
    this.reviewService.submitReviewForFoodItem(this.oid, this.food.fid, review).subscribe((res) => {
      Swal.fire({
        title: 'Review made successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }, ((err) => {
      Swal.fire({
        title: 'Review not made successfully',
        icon: 'error',
        confirmButtonText: 'OK',
      })
    }));
  }

}
