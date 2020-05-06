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
        retry(1),

        catchError(this.handleError)
      );
  }

  updateFoodItems(restId: any, menuId: any, foodId: any, foodToUpdate: any): Observable<any> {
    return this.httpClient.post<any>(this.path + '/restaurant_staff/' + this.sessionService.getUsername() + '/restaurant/' + restId + '/menus/' + menuId + '/' + foodId, foodToUpdate).pipe
      (
        retry(1),

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
