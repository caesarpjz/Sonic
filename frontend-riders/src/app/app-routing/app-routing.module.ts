import { SummaryComponent } from './../summary/summary.component';
import { DeliveriesComponent } from './../deliveries/deliveries.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { HomeComponent } from '../home/home.component';
import { SubmitScheduleComponent } from '../submit-schedule/submit-schedule.component';
import { SubmitScheduleMonthlyComponent } from '../submit-schedule-monthly/submit-schedule-monthly.component';
import { ViewScheduleComponent } from '../view-schedule/view-schedule.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'submit-schedule', component: SubmitScheduleComponent },
  { path: 'submit-schedule-monthly', component: SubmitScheduleMonthlyComponent },
  { path: 'view-schedule', component: ViewScheduleComponent },
  { path: 'deliveries', component: DeliveriesComponent },
  { path: 'summary', component: SummaryComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
