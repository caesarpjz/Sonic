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
export class FoodItemsService {

  path = "http://localhost:3002"

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  getFoodItems(restId: any, menuId: any): Observable<any> {
    return this.httpClient.get<any>(this.path + '/restaurant_staff/' + this.sessionService.getUsername() + '/restaurant/' + restId + '/menus/' + menuId + '/foods').pipe
      (

        catchError(this.handleError)
      );
  }

  updateFood(restId: any, menuId: any, foodId: any, foodToUpdate: any): Observable<any> {
    return this.httpClient.post<any>(this.path + '/restaurant_staff/' + this.sessionService.getUsername() + '/restaurant/' + restId + '/menus/' + menuId + '/' + foodId, foodToUpdate, { responseType: 'text' as 'json' }).pipe
      (

        catchError(this.handleError)
      );
  }

  createFood(restId: any, menuId: any, foodToCreate: any): Observable<any> {
    return this.httpClient.post<any>(this.path + '/restaurant_staff/' + this.sessionService.getUsername() + '/restaurant/ ' + restId + '/menus/' + menuId + '/addfood', foodToCreate, { responseType: 'text' as 'json' }).pipe
      (
        catchError(this.handleError)
      );
  }

  deleteFood(restId: any, menuId: any, foodId: any): Observable<any> {
    return this.httpClient.delete<any>(this.path + '/restaurant_staff/restaurant/' + restId + '/' + menuId + '/food/' + foodId + '/deletefood', { responseType: 'text' as 'json' }).pipe
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
