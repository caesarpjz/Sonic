import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
let activeRestaurantId = 0;

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
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

  // get all restraurants
  getRestaurants(): Observable<any> {
    return this.httpClient.get<any>('/api/restaurant');
  }

  // get restaurant by Id
  getRestaurant(id): Observable<any> {
    activeRestaurantId = id;
    return this.httpClient.get<any>('/api/restaurant/' + id);
  }

  // get restaurant menus
  getRestaurantMenus(id): Observable<any> {
    return this.httpClient.get<any>('/api/restaurant/' + id + '/menus');
  }

  // get food items from menu
  getRestaurantMenuFoodItems(restaurantId, menuId): Observable<any> {
    return this.httpClient.get<any>(`/api/restaurant/${restaurantId}/menus/${menuId}`);
  }

  // checkout order
  checkout(order): Observable<any> {
    const username = sessionStorage.getItem('username');
    return this.httpClient.post<any>(`/api/customer/${username}/restaurant/${activeRestaurantId}/order`, order).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
}
