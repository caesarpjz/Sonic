import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
  responseType: 'text' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpClient: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An unknown error has occurred:", error.error.message);
    } else {
      console.error(
        " A HTTP error has occurred: " +
        `HTTP ${error.status}: ${error.error.message}`
      );
    }

    return throwError(error);
  }

  submitDeliveryRating(did, rating): Observable<any> {
    const username = sessionStorage.getItem('username');

    let review = {
      'rating': rating
    }

    return this.httpClient.post<any>(`/api/customer/${username}/orders/${did}/review`, review,
      httpOptions).pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  submitReviewForFoodItem(oid, fid, text): Observable<any> {
    const username = sessionStorage.getItem('username');

    let review = {
      'review': text
    }

    return this.httpClient.post<any>(`/api/customer/${username}/orders/food_item/${oid}/${fid}/review`, review,
      httpOptions).pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

}
