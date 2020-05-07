import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SessionService } from '../services/session.service';
import { ManagersService } from '../services/managers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  loginError: boolean;
  errorMessage: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private managersService: ManagersService) {
    this.loginError = false
  }

  ngOnInit() {
    this.sessionService.setUsername(null);
    this.sessionService.setPassword(null);
    this.sessionService.setIsLogin(false);
  }

  login(): void {
    this.sessionService.setUsername(this.username);
    this.sessionService.setPassword(this.password);

    this.managersService.login(this.username, this.password).subscribe(
      response => {
        console.log(response);
        if (response != null) {
          this.sessionService.setIsLogin(true);
          this.sessionService.setUsername(this.username);
          //sessionStorage.setItem('serviceProvider', JSON.stringify(staff));
          this.router.navigate(["/main-page"]);
        }
      }
    ),
    error => {
      this.loginError = true;
      this.errorMessage = error;
    }
  }
}
