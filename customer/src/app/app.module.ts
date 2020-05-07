import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RestaurantCardComponent } from './shared/restaurant-card.component';
import { MenuFoodCardComponent } from './shared/menu-food-card.component';
import { CartComponent } from './cart/cart.component';
import { CartItemComponent } from './shared/cart-item.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertService } from './services/alert.service';
import { AlertComponent } from './alert/alert.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CreditcardComponent } from './creditcard/creditcard.component';
import { DropdownModule } from 'primeng/dropdown';
import { UpdateCcComponent } from './update-cc/update-cc.component';
import { ReviewsComponent } from './reviews/reviews.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    RestaurantsComponent,
    RestaurantComponent,
    RestaurantCardComponent,
    MenuFoodCardComponent,
    CartComponent,
    CartItemComponent,
    LoginComponent,
    SignupComponent,
    CheckoutComponent,
    ProfileComponent,
    AlertComponent,
    CreditcardComponent,
    UpdateCcComponent,
    ReviewsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RadioButtonModule,
    DropdownModule
  ],
  providers: [
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
