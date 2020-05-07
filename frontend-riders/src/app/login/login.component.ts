import { DeliveriesService } from './../services/deliveries.service';
import { Router } from '@angular/router';
import { AlertService } from './../services/alert.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private deliveriesService: DeliveriesService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.initLoginForm();
  }

  ngOnInit() {
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.authService.login(this.loginForm).subscribe((res) => {
      this.alertService.success('Login successful!');
      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('username', this.loginForm.value.username);

      this.deliveriesService.assignDeliveries().subscribe((res) => {
        console.log('x');
      });

      this.router.navigate(['/']);
    }, ((err) => {
      this.alertService.error('Invalid login credentials, please try again');
    }
    ));
  }

}
