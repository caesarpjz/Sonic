import { SharedService } from './../services/shared.service';
import { CustomerService } from './../services/customer.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creditcard',
  templateUrl: './creditcard.component.html',
  styleUrls: ['./creditcard.component.css']
})
export class CreditcardComponent implements OnInit {
  card: any;
  selected = false;

  constructor(private customerService: CustomerService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.retrieveCreditCardInfo();
  }

  onClick() {
    if (!this.selected) {
      this.selected = true;
    } else {
      this.selected = false;
    }

    this.sharedService.toggleCard(this.card);
  }

  retrieveCreditCardInfo() {
    this.customerService.getProfile().subscribe((res) => {
      this.card = {
        'name': res[0].cc_name,
        'expiry': res[0].cc_expiry,
        'number': res[0].cc_num
      };
    }, (err) => {
      console.error(err);
    })
  }

}
