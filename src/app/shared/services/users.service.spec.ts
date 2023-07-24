import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

describe('UsersService', () => {
  let service: UsersService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    //create http spy
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(UsersService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should send a GET request to the correct URL without pagination parameters', () => {
      httpClientSpy.get.and.returnValue(of([]));

      service.getUsers().subscribe(() => {});
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        environment.apiUrl + 'users',
        {
          params: new HttpParams(),
        }
      );
    });
    // @Todo- need to write test case
    xit('should send a GET request to the correct URL with pagination parameters', () => {
      const pageIndex = 2;
      const pageSize = 10;
      const params = new HttpParams().append('page', '3').append('limit', '10');
      httpClientSpy.get.and.returnValue(of([]));
      service.getUsers(pageIndex, pageSize).subscribe(() => {});
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        environment.apiUrl + 'users',
        {
          params,
        }
      );
    });
  });

  describe('addUser', () => {
    it('should send a POST request to the correct URL with the provided user', () => {
      const user: User = {
        id: 1,
        name: 'John Doe',
        avatar: '',
        status: false,
        email: '',
        createdAt: '',
      };
      httpClientSpy.post.and.returnValue(of(user));
      const result = service.addUser(user);
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        environment.apiUrl + 'users',
        user
      );
      expect(result).toBeInstanceOf(Observable);
    });
  });
});
