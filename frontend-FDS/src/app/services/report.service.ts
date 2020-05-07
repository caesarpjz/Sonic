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
export class ReportService {

  path = "http://localhost:3002";

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  generateMonthCustomerReport(): Observable<any> {
    return this.httpClient.get<any>(this.path + "/managers/monthCustomerReport").pipe
      (
        catchError(this.handleError)
      );
  }

  getEachCustomerReport(): Observable<any> {
    return this.httpClient.get<any>(this.path + "/managers/eachCustomerReport").pipe
      (
        catchError(this.handleError)
      );
  }

  getHourlyLocationReport(): Observable<any> {
    return this.httpClient.get<any>(this.path + "/managers/hourlylocationreport").pipe
      (
        catchError(this.handleError)
      );
  }

  getLocationReportOverview(): Observable<any> {
    return this.httpClient.get<any>(this.path + "/managers/locationreportoverview").pipe
      (
        catchError(this.handleError)
      );
  }

  getRiderReportOverview(): Observable<any> {
    return this.httpClient.get<any>(this.path + "/managers/riderreportoverview").pipe
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
