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
export class PromotionsService {

  path = "http://localhost:3002"

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  getPromotions(restId: any): Observable<any> {
    return this.httpClient.get<any>(this.path + "/restaurant_staff/" + this.sessionService.getUsername() + "/restaurant/" + restId + "/promotionslist").pipe
      (
        catchError(this.handleError)
      );
  }

  updatePromotion(restId: any, pid: any, promotionToUpdate: any): Observable<any> {
    return this.httpClient.post<any>(this.path + '/restaurant_staff/' + this.sessionService.getUsername() + '/restaurant/' + restId + '/promotions/' + pid, promotionToUpdate).pipe
      (
        catchError(this.handleError)
      );
  }

  deletePromotion(restId: any, pid: any): Observable<any> {
    return this.httpClient.delete<any>(this.path + '/restaurant_staff/' + this.sessionService.getUsername() + '/restaurant/' + restId + '/promotions/delete/' + pid).pipe
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
