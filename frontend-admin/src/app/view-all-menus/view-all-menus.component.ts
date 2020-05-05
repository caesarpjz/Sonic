import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Menu } from '../menu';

@Component({
  selector: 'app-view-all-menus',
  templateUrl: './view-all-menus.component.html',
  styleUrls: ['./view-all-menus.component.css']
})
export class ViewAllMenusComponent implements OnInit {

  menus: Menu[] = [];
  displayUpdate: boolean = false;
  displayAdd: boolean = false;
  menuToView: Menu;
  submitted: boolean;
  newMenu: Menu;

  constructor() {
    this.submitted = false;
    this.newMenu = new Menu();
  }

  ngOnInit() {
    let menu1: Menu;
    menu1 = new Menu(1, "Breakfast");

    let menu2: Menu;
    menu2 = new Menu(2, "Lunch");

    let menu3: Menu;
    menu3 = new Menu(3, "Dinner");

    this.menus.push(menu1);
    this.menus.push(menu2);
    this.menus.push(menu3);
  }

  showDialog1(menuToView: Menu) {
    this.displayUpdate = true;
    this.menuToView = menuToView;
  }

  showDialog2() {
    this.displayAdd = true;
  }

  deleteMenu(menuToDelete: Menu) {
    const index: number = this.menus.indexOf(menuToDelete);
    this.menus.splice(index, 1);
  }

  update(updateMenuForm: NgForm) {
  }

  clear() {
    this.submitted = false;
    this.newMenu = new Menu();
  }

  addMenu(addFoodForm: NgForm) {
    this.menus.push(this.newMenu);
    this.displayAdd = false;
  }
}
