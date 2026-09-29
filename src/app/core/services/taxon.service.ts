import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Taxon,
  TaxonResponse,
  TaxonSearchParams,
  TaxonAutocompleteResponse,
} from '@core/models';

@Injectable({ providedIn: 'root' })
export class TaxonService {
  private readonly basePath = '/api/taxa';

  constructor(private readonly http: HttpClient) {}

  search(params: TaxonSearchParams): Observable<TaxonResponse> {
    const httpParams = this.buildParams(params);
    return this.http.get<TaxonResponse>(this.basePath, {
      params: httpParams,
    });
  }

  getById(id: number): Observable<Taxon> {
    return this.http
      .get<TaxonResponse>(`${this.basePath}/${id}`)
      .pipe(map((response) => response.results[0]));
  }

  autocomplete(q: string, perPage = 10): Observable<TaxonAutocompleteResponse> {
    const params = new HttpParams()
      .set('q', q)
      .set('per_page', perPage.toString());
    return this.http.get<TaxonAutocompleteResponse>(
      `${this.basePath}/autocomplete`,
      { params }
    );
  }

  private buildParams<T extends object>(params: T): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }
}
