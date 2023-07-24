import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

/**
 * UsersService
 * This service is responsible for handling HTTP requests related to users.
 */
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves a list of users from the backend API based on the optional 'pageIndex',
   * 'pageSize', and 'filterStr' parameters.
   *
   * @param pageIndex Optional. The page index for pagination.
   * @param pageSize Optional. The number of items per page for pagination.
   * @param filterStr Optional. The filter string to search for users by name.
   * @returns An Observable<User[]> representing the list of users retrieved from the API.
   */
  getUsers(
    pageIndex?: number,
    pageSize?: number,
    filterStr?: string
  ): Observable<User[]> {
    let params = new HttpParams();
    if (filterStr && filterStr !== '') {
      params = params.append('name', filterStr);
    } else if (
      pageIndex !== undefined &&
      pageSize !== undefined &&
      filterStr == undefined
    ) {
      params = params.append('page', pageIndex + 1);
      params = params.append('limit', pageSize);
    }
    return this.http.get<User[]>(environment.apiUrl + 'users', { params });
  }

  /**
   * Adds a new user to the backend API by sending a POST request to the 'users' endpoint.
   *
   * @param user The user object to be added to the API.
   * @returns An Observable<User> representing the response from the API.
   */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(environment.apiUrl + 'users', user);
  }
}
