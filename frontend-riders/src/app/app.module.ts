import { AlertService } from './services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { FullCalendarModule } from 'primeng/fullcalendar';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppHeaderComponent } from './shared/app-header/app-header.component';
import { AppFooterComponent } from './shared/app-footer.component';
import { SubmitScheduleComponent } from './submit-schedule/submit-schedule.component';
import { SubmitScheduleMonthlyComponent } from './submit-schedule-monthly/submit-schedule-monthly.component';
import { ViewScheduleComponent } from './view-schedule/view-schedule.component';
import { AlertComponent } from './alert/alert.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { ProfileComponent } from './profile/profile.component';
import { TabViewModule } from 'primeng/tabview';
import { SummaryComponent } from './summary/summary.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    AppHeaderComponent,
    AppFooterComponent,
    SubmitScheduleComponent,
    SubmitScheduleMonthlyComponent,
    ViewScheduleComponent,
    AlertComponent,
    DeliveriesComponent,
    ProfileComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    CommonModule,
    CheckboxModule,
    FullCalendarModule,
    HttpClientModule,
    TabViewModule
  ],
  providers: [AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
