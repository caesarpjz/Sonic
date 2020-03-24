import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu-food-card',
  templateUrl: './menu-food-card.component.html',
  styleUrls: ['./menu-food-card.component.css']
})
export class MenuFoodCardComponent implements OnInit {
  @Input() foodName: string;

  constructor() { }

  ngOnInit() {
  }

}
