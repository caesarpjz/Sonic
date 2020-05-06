import { CustomerService } from './../services/customer.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  customer: any;

  constructor(private router: Router, private customerService: CustomerService) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('loggedIn')) {
      this.router.navigate(['/login']);
    } else {
      this.getCustomerProfile();
    }
  }

  getCustomerProfile() {
    this.customerService.getProfile().subscribe((res) => {
      this.customer = res[0];
    });
  }

}
