import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    MainPageComponent,
    HeaderComponent,
    FooterComponent,
    ViewAllFoodItemsComponent,
    ViewAllMenusComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
