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
export class ReviewsService {

  path = "http://localhost:3002"

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  // getReviews(this.restId: any): Observable<any> {
  //   return this.httpClient.get<any>(this.path + '/restaurant_staff/'+ this.sessionService.getUsername() + '/restaurant/'+ this.restId + '/menus/:menu_id/foods/:fid/reviews')
  // }
}
