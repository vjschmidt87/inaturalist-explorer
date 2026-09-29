import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlaceAutocompleteResponse } from '@core/models';

@Injectable({ providedIn: 'root' })
export class PlaceService {
  private readonly basePath = '/api/places';

  constructor(private readonly http: HttpClient) {}

  autocomplete(q: string, perPage = 10): Observable<PlaceAutocompleteResponse> {
    const params = new HttpParams()
      .set('q', q)
      .set('per_page', perPage.toString());
    return this.http.get<PlaceAutocompleteResponse>(
      `${this.basePath}/autocomplete`,
      { params }
    );
  }
}
