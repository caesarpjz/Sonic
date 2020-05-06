import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Menu } from '../classes/menu';
import { Restaurant } from '../classes/restaurant';
import { MenuService } from '../services/menu.service';
import { RestaurantService } from '../services/restaurant.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-view-all-menus',
  templateUrl: './view-all-menus.component.html',
  styleUrls: ['./view-all-menus.component.css']
})
export class ViewAllMenusComponent implements OnInit {

  menus: any;
  restId: any;
  displayUpdate: boolean = false;
  displayAdd: boolean = false;
  menuToView: any;
  submitted: boolean;
  newMenu: any;


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private sessionService: SessionService,
    private restaurantService: RestaurantService) {
    this.submitted = false;
    this.newMenu = new Menu();
  }

  ngOnInit() {

    this.restaurantService.getRestaurant().subscribe(
      response => {
        console.log(response.rest_id);
        this.restId = response.rest_id;
        this.menuService.getMenus(this.restId).subscribe(
          response => {
            console.log(response.length)
            this.menus = response;
          },
          error => {
            console.log('********** GetAllMenusComponent.ts: ' + error);
          }
        )
      },
      error => {
        console.log('********** GetRestaurantComponent.ts: ' + error);
      }
    )


  }

  showDialog1(menuToView: Menu) {
    this.displayUpdate = true;
    this.menuToView = menuToView;
  }

  showDialog2() {
    this.displayAdd = true;
  }

  deleteMenu(menuToDelete: any) {
    this.menuService.deleteMenu(menuToDelete["menu_id"], this.restId).subscribe(
      response => {
        this.router.navigate(["/view-all-menus"]);
        this.menuService.getMenus(this.restId).subscribe(
          response => {
            console.log(response.length)
            this.menus = response;
          },
          error => {
            console.log('********** GetAllMenusComponent.ts: ' + error);
          }
        )
      },
    )
  }

  update(updateMenuForm: NgForm) {
    console.log(this.menuToView);
    let menuId:string = this.menuToView["menu_id"];
    let menuName: string = this.menuToView["name"];
    this.menuService.updateMenu(menuId, menuName, this.restId).subscribe(
      response => {
        this.menuService.getMenus(this.restId).subscribe(
          response => {
            console.log(response.length)
            this.menus = response;
          },
          error => {
            console.log('********** GetAllMenusComponent.ts: ' + error);
          }
        );
      },
      error => {

        console.log('********** UpdateProductComponent.ts: ' + error);
      }
    );
  }

  clear() {
    this.submitted = false;
    this.newMenu = new Menu();
  }

  addMenu(addFoodForm: NgForm) {
    let menuName: string = this.newMenu["name"];
    console.log(menuName);
      this.menuService.createMenu(this.restId, menuName).subscribe(
        response => {
          this.displayAdd = false;
        }
      );
  }
}
