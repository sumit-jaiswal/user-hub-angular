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

  getUsers(pageIndex?: number, pageSize?: number): Observable<User[]> {
    let params = new HttpParams();
    if (pageIndex !== undefined && pageSize !== undefined) {
      params = params.append('page', (pageIndex + 1).toString());
      params = params.append('limit', pageSize.toString());
    }
    return this.http.get<User[]>(environment.apiUrl + '/users', { params });
  }
}
