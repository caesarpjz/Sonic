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
export class ManagersService {

  path = "http://localhost:3002"

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  login(username: string, password: string): Observable<any> {
    let user: any = {
      "username": username,
      "password": password
    }
    return this.httpClient.post<any>(this.path + '/managers/login', user, { responseType: 'text' as 'json' }).pipe
      (
        retry(1),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = "";
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // errorMessage = error.error.message;
      console.log(error.error.message)
    }
    else {
      console.log(error.error.message, " Please try again!");
      errorMessage = error.error.message + " Please try again!";
    }

    return throwError(errorMessage);
  }
}
