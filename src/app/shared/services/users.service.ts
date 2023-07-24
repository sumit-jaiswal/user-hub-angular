import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

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

  addUser(user: User): Observable<User> {
    return this.http.post<User>(environment.apiUrl + 'users', user);
  }
}
