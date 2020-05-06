import { SharedService } from './../services/shared.service';
import { Router } from '@angular/router';
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
    private alertService: AlertService,
    private router: Router,
    private sharedService: SharedService
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
    this.authService.login(this.loginForm).subscribe((res) => {
      this.alertService.success('Login successful!');

      this.sharedService.setUsername(this.loginForm.value.username);
      this.sharedService.toggleLoggedIn();

      this.router.navigate(['/']);
    }, (err) => {
      this.alertService.error('Invalid login credentials, please try again')
    });
  }

}
