import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AuthService]
})
export class HeaderComponent implements OnInit {
  username: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}
