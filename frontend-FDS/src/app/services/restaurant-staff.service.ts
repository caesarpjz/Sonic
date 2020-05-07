import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { SessionService } from './session.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RestaurantStaffService {

  path = "http://localhost:3002";

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  getRestaurantStaff(restId: any): Observable<any> {
    return this.httpClient.get<any>(this.path + "/managers/restaurant/" + restId + "/restaurant_staff").pipe
      (
        catchError(this.handleError)
      );
  }

  createRestaurantStaff(restId: any, newRestaurantStaff: any): Observable<any> {
    // console.log(newPromotion.start_time)
    return this.httpClient.post<any>(this.path + '/managers/restaurant/'+ restId +'/staff', newRestaurantStaff, { responseType: 'text' as 'json' }).pipe
      (
        catchError(this.handleError)
      );
  }

  deleteRestaurantStaff(rest_id: any, rsid: any): Observable<any> {
    // console.log(pid);
    return this.httpClient.delete<any>(this.path + '/managers/restaurant/'+ rest_id +'/restaurant_staff/'+ rsid +'/delete', { responseType: 'text' as 'json' }).pipe
      (
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = "";

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    }
    else {
      errorMessage = error.error.message + " Please try again!";
    }

    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
