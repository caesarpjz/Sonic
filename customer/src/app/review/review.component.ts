import { AlertService } from './../services/alert.service';
import { CustomerService } from './../services/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../services/review.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  orderId: any;
  deliveryId: any;

  foodItems: any;

  deliveryRatingForm: FormGroup;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private reviewService: ReviewService,
    private formBuilder: FormBuilder,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('oid');
    this.deliveryId = this.route.snapshot.paramMap.get('did');

    this.retrieveFoodItems();
    this.initDeliveryRatingForm();
  }

  initDeliveryRatingForm() {
    this.deliveryRatingForm = this.formBuilder.group({
      rating: ['', Validators.required]
    });
  }

  submitDeliveryRating() {
    this.reviewService.submitDeliveryRating(this.deliveryId, this.deliveryRatingForm.value.rating).subscribe((res) => {
      Swal.fire({
        title: 'Rating made successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }, ((err) => {
      Swal.fire({
        title: 'Rating not made',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }));
  }

  retrieveFoodItems() {
    this.customerService.getFoodByOrder(this.orderId).subscribe((res) => {
      this.foodItems = res;
    });
  }
}
