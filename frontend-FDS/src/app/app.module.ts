import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HeaderComponent } from './header/header.component';
import { PromotionsComponent } from './promotions/promotions.component';

import {DropdownModule} from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import {CheckboxModule} from 'primeng/checkbox';
import { ViewAllRestaurantsComponent } from './view-all-restaurants/view-all-restaurants.component';
import { ViewAllRestaurantStaffComponent } from './view-all-restaurant-staff/view-all-restaurant-staff.component';
import { ViewAllRidersComponent } from './view-all-riders/view-all-riders.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainPageComponent,
    HeaderComponent,
    PromotionsComponent,
    ViewAllRestaurantsComponent,
    ViewAllRestaurantStaffComponent,
    ViewAllRidersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TableModule,
    BrowserAnimationsModule,
    DialogModule,
    ButtonModule,
    PanelModule,
    FormsModule,
    HttpClientModule,
    CheckboxModule,
    DropdownModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
