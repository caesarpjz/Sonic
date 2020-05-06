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
export class CustomerService {

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

  // view customer profile: has cc info and points
  // localhost:3002/customer/mrpresident/profile
  getProfile(): Observable<any> {
    const username = sessionStorage.getItem('username');
    return this.httpClient.get<any>('/api/customer/' + username + '/profile');
  }

  // insert cc info
  // localhost:3002/customer/mrpresident/profile/insertCC
  addCard(card): Observable<any> {
    const username = sessionStorage.getItem('username');

    return this.httpClient.post<any>(`/api/customer/${username}/profile/insertCC`, card,
      httpOptions).pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

}
