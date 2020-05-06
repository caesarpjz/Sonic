import { CustomerService } from './../services/customer.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creditcard',
  templateUrl: './creditcard.component.html',
  styleUrls: ['./creditcard.component.css']
})
export class CreditcardComponent implements OnInit {
  card: any;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.retrieveCreditCardInfo();
  }

  retrieveCreditCardInfo() {
    this.customerService.getProfile().subscribe((res) => {
      this.card = {
        'name': res.cc_name,
        'expiry': res.cc_expiry,
        'number': res.cc_num
      }

      console.log(this.card);
    }, (err) => {
      console.error(err);
    })
  }

}
