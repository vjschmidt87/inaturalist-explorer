import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  User,
  UserDetail,
  UserResponse,
  UserAutocompleteResponse,
} from '@core/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly basePath = '/api/users';

  constructor(private readonly http: HttpClient) {}

  getById(id: number): Observable<UserDetail> {
    return this.http
      .get<{ results: UserDetail[] }>(`${this.basePath}/${id}`)
      .pipe(map((response) => response.results[0]));
  }

  getByLogin(login: string): Observable<UserDetail> {
    return this.http
      .get<{ results: UserDetail[] }>(`${this.basePath}/${login}`)
      .pipe(map((response) => response.results[0]));
  }

  autocomplete(q: string, perPage = 10): Observable<UserAutocompleteResponse> {
    const params = new HttpParams()
      .set('q', q)
      .set('per_page', perPage.toString());
    return this.http.get<UserAutocompleteResponse>(
      `${this.basePath}/autocomplete`,
      { params }
    );
  }
}
