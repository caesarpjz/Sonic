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
export class RidersService {

  path = "http://localhost:3002";

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  getRiders(): Observable<any> {
    return this.httpClient.get<any>(this.path + '/managers/admin/riders').pipe
      (
        catchError(this.handleError)
      );
  }

  getRiderShift(rid: any): Observable<any> {
    return this.httpClient.get<any>(this.path + '/managers/admin/riders/'+ rid +'/shifts').pipe
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
