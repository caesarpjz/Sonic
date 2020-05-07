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

  path = "http://localhost:3002"

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  getRestaurant(): Observable<any> {
    console.log(this.sessionService.getUsername());
    return this.httpClient.get<any>(this.path + "/restaurant_staff/" + this.sessionService.getUsername() + "/restaurant").pipe
    (
      catchError(this.handleError)
    );
  }

  updateInfo(restId: any, restaurantToUpdate: any): Observable<any> {
    return this.httpClient.post<any>(this.path + "/restaurant_staff/" + this.sessionService.getUsername() + "/restaurant/" + restId, restaurantToUpdate).pipe
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
