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

@Injectable()
export class AuthService {
  path = '/api';
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

  // create customer
  createCustomer(signupForm): Observable<any> {
    let customer = {
      'username': signupForm.value.username,
      'password': signupForm.value.password,
      'name': signupForm.value.name
    };

    return this.httpClient.post<any>('/api/customers', customer,
           httpOptions).pipe(
             retry(1),
             catchError(this.handleError)
           );
  }

  login(form): Observable<any> {
    let user = {
      'username': form.value.username,
      'password': form.value.password
    };

    return this.httpClient.post<any>('/api/customer/login', user,
      httpOptions).pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  logout() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('username');
  }
}
