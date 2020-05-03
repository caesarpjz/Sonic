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

  // get restaurant by Id
  getRestaurant(id): Observable<any> {
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
}
