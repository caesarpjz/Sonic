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
export class RestaurantService {

  path = "http://localhost:3002";

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  getRestaurants(): Observable<any> {
    return this.httpClient.get<any>(this.path + "/managers/restaurant").pipe
      (
        catchError(this.handleError)
      );
  }

  createRestaurant(newRestaurant: any): Observable<any> {
    // console.log(newPromotion.start_time)
    console.log(newRestaurant.category);
    return this.httpClient.post<any>(this.path + '/managers/admin/createRestaurant', newRestaurant, { responseType: 'text' as 'json' }).pipe
      (
        catchError(this.handleError)
      );
  }

  deleteRestaurant(rest_id: any): Observable<any> {
    // console.log(pid);
    return this.httpClient.delete<any>(this.path + '/managers/restaurant/' + rest_id + '/delete', { responseType: 'text' as 'json' }).pipe
      (
        catchError(this.handleError)
      );
  }

  updateRestaurant(rest_id: any, restaurantToUpdate: any): Observable<any> {
    return this.httpClient.post<any>(this.path + '/managers/restaurant/' + rest_id + '/update', restaurantToUpdate, { responseType: 'text' as 'json' }).pipe
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
