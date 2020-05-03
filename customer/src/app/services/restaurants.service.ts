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

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  constructor(private httpClient: HttpClient) { }

  // get all restraurants
  getRestaurants(): Observable<any> {
    return this.httpClient.get<any>('/api/restaurant');
  }
}
