import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { SessionService } from './session.service';
import { Menu } from '../classes/menu';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  path = "http://localhost:3002"

  constructor(private httpClient: HttpClient,
    private sessionService: SessionService) { }

  getMenus(restId: any): Observable<any> {
    return this.httpClient.get<any>(this.path + "/restaurant_staff/" + this.sessionService.getUsername() + '/restaurant/' + restId + '/menus').pipe
      (
        catchError(this.handleError)
      );
  }

  createMenu(restId: any, menuName: String): Observable<any> {
    console.log(menuName);
    let newMenuName = {
      "menu_name": menuName
    }
    return this.httpClient.post<any>(this.path + "/restaurant_staff/" + this.sessionService.getUsername() + "/restaurant/" + restId +"/add/menu", newMenuName).pipe 
    (
      catchError(this.handleError)
    );
  }

  updateMenu(menuId: String, menuName: String, restId: any): Observable<any> {
    console.log(restId);
    console.log(menuId);
    console.log(menuName);
    let updatedMenuName = {
      "new_name": menuName
    }
    return this.httpClient.post<any>(this.path + "/restaurant_staff/" + this.sessionService.getUsername() + "/restaurant/ " + restId + "/" + menuId, updatedMenuName).pipe
      (
        catchError(this.handleError)
      );
  }

  deleteMenu(menuId: String, restId: any): Observable<any> {
    return this.httpClient.delete<any>(this.path + "/restaurant_staff/"+ this.sessionService.getUsername() +"/restaurant/"+ restId + "/deleteid/" + menuId).pipe
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
