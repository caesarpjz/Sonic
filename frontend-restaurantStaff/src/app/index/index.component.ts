import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SessionService } from '../services/session.service';
import { Staff } from '../classes/staff';
import { StaffService } from '../services/staff.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [StaffService, AlertService],
})
export class IndexComponent implements OnInit {

  username: string;
  password: string;
  loginError: boolean;
  errorMessage: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private staffService: StaffService,
    private alertService: AlertService
  ) {
    this.loginError = false
  }

  ngOnInit() {
    this.sessionService.setUsername(null);
    this.sessionService.setPassword(null);
    this.sessionService.setIsLogin(false);
    this.sessionService.setCurrentStaff(null);
  }

  login(): void {
    this.sessionService.setUsername(this.username);
    this.sessionService.setPassword(this.password);

    this.staffService.login(this.username, this.password).subscribe(
      response => { 
        console.log(response);
        if (response != null) {
          this.sessionService.setIsLogin(true);
          this.sessionService.setUsername(response);
          //sessionStorage.setItem('serviceProvider', JSON.stringify(staff));
          this.loginError = false;

          this.router.navigate(["/main-page"]);
        } else {
          this.loginError = true;
        }
      }
    ),
    error => {
      this.alertService.error('Invalid login credentials, please try again')
    }
  }

}
