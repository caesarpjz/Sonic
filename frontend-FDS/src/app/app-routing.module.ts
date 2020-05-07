import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component'; 
import { MainPageComponent } from './main-page/main-page.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { ViewAllRestaurantsComponent } from './view-all-restaurants/view-all-restaurants.component';
import { ViewAllRestaurantStaffComponent } from './view-all-restaurant-staff/view-all-restaurant-staff.component';
import { ViewAllRidersComponent } from './view-all-riders/view-all-riders.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main-page', component: MainPageComponent},
  { path: 'promotions', component: PromotionsComponent},
  { path: 'view-all-restaurants', component: ViewAllRestaurantsComponent},
  { path: 'view-all-restaurantStaff', component: ViewAllRestaurantStaffComponent},
  { path: 'view-all-restaurantStaff/:rest_id', component: ViewAllRestaurantStaffComponent},
  { path: 'view-all-riders', component: ViewAllRidersComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
