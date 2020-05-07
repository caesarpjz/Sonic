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
    private authService: AuthService
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
    // @todos: call auth service
    console.log(this.loginForm);

    this.authService.login(this.loginForm).subscribe((res) => {
      console.log(res);
    }, ((err) => {
      console.error(err);
    }
    ));
  }

}
