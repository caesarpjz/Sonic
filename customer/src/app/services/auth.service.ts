import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable()
export class AuthService {
  path = '/api';
  constructor(private httpClient: HttpClient) { }

  // create customer
  createCustomer(signupForm): Observable<any> {
    let customer = {
      'username': signupForm.value.username,
      'password': signupForm.value.password,
      'name': signupForm.value.name
    };

    return this.httpClient.post<any>('/api/customers', customer,
           { responseType: 'text' as 'json' });
  }

  login(form): Observable<any> {
    let user = {
      'username': form.value.username,
      'password': form.value.password
    };

    return this.httpClient.post<any>('/api/customer/login', user,
      { responseType: 'text' as 'json' });
  }
}
