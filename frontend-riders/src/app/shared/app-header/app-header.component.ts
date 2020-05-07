import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  username: string;
  isFullTime = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');

    if (this.username) {
      this.checkFullTime();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  checkFullTime() {
    this.authService.isFullTime().subscribe((res) => {
      this.isFullTime = res[0].is_full_time;
    });
  }

}
