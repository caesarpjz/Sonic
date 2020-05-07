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
export class DeliveriesService {

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

  // retrieve assigned deliveries
  getAssignedDeliveries(): Observable<any> {
    const username = sessionStorage.getItem('username');
    return this.httpClient.get<any>(`/api/riders/${username}/deliveries/assigned`);
  }

  // retrieve completed deliveries
  getDeliveryHistory(): Observable<any> {
    const username = sessionStorage.getItem('username');
    return this.httpClient.get<any>(`/api/riders/${username}/deliveries/history`);
  }
}
