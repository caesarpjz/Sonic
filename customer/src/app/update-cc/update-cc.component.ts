import { Router } from '@angular/router';
import { AlertService } from './../services/alert.service';
import { CustomerService } from './../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-update-cc',
  templateUrl: './update-cc.component.html',
  styleUrls: ['./update-cc.component.css']
})
export class UpdateCcComponent implements OnInit {
  creditCardForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private alertService: AlertService,
    private router: Router) {
    this.initCreditCardForm();
  }

  ngOnInit(): void {
  }

  initCreditCardForm() {
    this.creditCardForm = this.formBuilder.group({
      name: ['', Validators.required],
      expiryMonth: ['', Validators.required],
      expiryYear: ['', Validators.required],
      creditCardNumber: ['', [Validators.required, this.checkLimit(1000000000000000, 9999999999999999)]],
      cvv: ['', Validators.required]
    });
  }

  checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { 'range': true };
      }
      return null;
    };
  }

  submit() {
    let valid = true;
    // check if fields are valid
    const date = `${this.creditCardForm.value.expiryMonth}/${this.creditCardForm.value.expiryYear}`;

    if (this.creditCardForm.value.creditCardNumber.length < 16 ||
      isNaN(this.creditCardForm.value.creditCardNumber) ||
      (Number(this.creditCardForm.value.expiryYear) === 2020 && Number(this.creditCardForm.value.expiryMonth) < 6)) {
      valid = false;
    }

    if (valid) {
      const card = {
        'cc_name': this.creditCardForm.value.name,
        'expiryDate': date,
        'num': this.creditCardForm.value.creditCardNumber
      };

      this.customerService.addCard(card).subscribe((res) => {
        this.alertService.success('Credit card updated!');
      });
    } else {
      this.alertService.error('Invalid credit card information, please try again.');
    }
  }

  back() {
    this.router.navigate(['/profile']);
  }

}
