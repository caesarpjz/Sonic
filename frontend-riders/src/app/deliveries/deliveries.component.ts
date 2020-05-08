import { DeliveriesService } from './../services/deliveries.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
  assignedDeliveries = null;
  pastDeliveries = null;

  constructor(private deliveriesService: DeliveriesService) { }

  ngOnInit(): void {
    this.retrieveAssignedDeliveries();
    this.retrievePastDeliveries();
  }

  retrieveAssignedDeliveries() {
    this.deliveriesService.getAssignedDeliveries().subscribe((res) => {
      this.assignedDeliveries = res;
    });
  }

  retrievePastDeliveries() {
    this.deliveriesService.getDeliveryHistory().subscribe((res) => {
      this.pastDeliveries = res;
    });
  }

  markGoingRestaurant(did) {
    this.deliveriesService.markGoingRestaurant(did).subscribe((res) => {
      Swal.fire({
        title: 'Marked as going to restaurant!',
        icon: 'success',
        confirmButtonText: 'Ok',
        showCancelButton: true,
      });
    });
  }

  markArriveRestaurant(did) {
    this.deliveriesService.markArriveRestaurant(did).subscribe((res) => {
      Swal.fire({
        title: 'Marked as arrived at restaurant!',
        icon: 'success',
        confirmButtonText: 'Ok',
        showCancelButton: true,
      });
    });
  }

  markLeavingRestaurant(did) {
    this.deliveriesService.markLeavingRestaurant(did).subscribe((res) => {
      Swal.fire({
        title: 'Marked as leaving restaurant!',
        icon: 'success',
        confirmButtonText: 'Ok',
        showCancelButton: true,
      });
    });
  }

  markDelivered(did) {
    this.deliveriesService.markDelivered(did).subscribe((res) => {
      Swal.fire({
        title: 'Marked as delivered!',
        icon: 'success',
        confirmButtonText: 'Ok',
        showCancelButton: true,
      });
    });
  }

}
