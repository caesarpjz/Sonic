import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ViewAllFoodItemsComponent } from './view-all-food-items/view-all-food-items.component';
import { ViewAllMenusComponent } from './view-all-menus/view-all-menus.component';
import { ViewAllPromotionsComponent } from './view-all-promotions/view-all-promotions.component';
import { ViewAllReviewsComponent } from './view-all-reviews/view-all-reviews.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'main-page', component: MainPageComponent},
  { path: 'view-all-food-items', component: ViewAllFoodItemsComponent},
  { path: "view-all-food-items/:menuId", component: ViewAllFoodItemsComponent},
  { path: "view-all-menus", component: ViewAllMenusComponent},
  { path: "view-all-promotions",  component: ViewAllPromotionsComponent},
  { path: "view-all-reviews", component: ViewAllReviewsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
