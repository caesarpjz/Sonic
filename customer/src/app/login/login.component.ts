import { AlertService } from '../services/alert.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService, AlertService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.initLoginForm();
  }

  ngOnInit() {
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
        ])
      ],
      password: ['', Validators.required]
    });
  }

  login() {
    // @todos: call auth service
    console.log(this.loginForm);
    this.authService.login(this.loginForm).subscribe((res) => {
      this.alertService.success('Login successful!');
      sessionStorage.setItem('loggedIn', 'true');
      // save username from res as well to display the name?
      sessionStorage.setItem('username', this.loginForm.value.username);
      // route to login page?
    }, (err) => {
      this.alertService.error('Invalid login credentials, please try again')
    });
  }

}
