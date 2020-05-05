import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  username: string;
  password: string;
  
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {
  }

  staffLogin(): void {
    this.router.navigate([]);
  }

}
