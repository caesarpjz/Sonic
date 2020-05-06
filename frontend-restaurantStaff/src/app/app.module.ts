import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ViewAllFoodItemsComponent } from './view-all-food-items/view-all-food-items.component';

import { TableModule } from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import { ViewAllMenusComponent } from './view-all-menus/view-all-menus.component';
import { ViewAllPromotionsComponent } from './view-all-promotions/view-all-promotions.component';
import { ViewAllReviewsComponent } from './view-all-reviews/view-all-reviews.component';
import { AlertService } from './services/alert.service';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    MainPageComponent,
    HeaderComponent,
    FooterComponent,
    ViewAllFoodItemsComponent,
    ViewAllMenusComponent,
    ViewAllPromotionsComponent,
    ViewAllReviewsComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    BrowserAnimationsModule,
    DialogModule,
    ButtonModule,
    PanelModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    AlertService,
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
