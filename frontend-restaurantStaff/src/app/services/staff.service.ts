import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { SessionService } from './session.service';
import { Staff } from '../classes/staff';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  path = '/api';

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }


  login(username: string, password: string): Observable<any> {
    console.log(username);
    console.log(password);
    let user = {
      'username': username,
      'password': password
    }
    return this.httpClient.post<any>('http://localhost:3002/restaurant_staff/login', user, { responseType: 'text' as 'json' }).pipe (
      retry(1),

      catchError(this.handleError)
    )
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
