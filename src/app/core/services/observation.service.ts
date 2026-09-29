import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Observation,
  ObservationResponse,
  ObservationSearchParams,
} from '@core/models';

@Injectable({ providedIn: 'root' })
export class ObservationService {
  private readonly basePath = '/api/observations';

  constructor(private readonly http: HttpClient) {}

  search(params: ObservationSearchParams): Observable<ObservationResponse> {
    const httpParams = this.buildParams(params);
    return this.http.get<ObservationResponse>(this.basePath, {
      params: httpParams,
    });
  }

  getById(id: number): Observable<Observation> {
    return this.http
      .get<ObservationResponse>(`${this.basePath}/${id}`)
      .pipe(map((response) => response.results[0]));
  }

  getSpeciesCount(
    params: Omit<ObservationSearchParams, 'per_page' | 'page'>
  ): Observable<{ total_results: number; results: SpeciesCount[] }> {
    const httpParams = this.buildParams(params);
    return this.http.get<{ total_results: number; results: SpeciesCount[] }>(
      `${this.basePath}/species_counts`,
      { params: httpParams }
    );
  }

  getObservers(
    params: Omit<ObservationSearchParams, 'order_by'>
  ): Observable<{ total_results: number; results: ObserverCount[] }> {
    const httpParams = this.buildParams(params);
    return this.http.get<{ total_results: number; results: ObserverCount[] }>(
      `${this.basePath}/observers`,
      { params: httpParams }
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

interface SpeciesCount {
  count: number;
  taxon: import('@core/models').Taxon;
}

interface ObserverCount {
  user_id: number;
  observation_count: number;
  species_count: number;
  user: import('@core/models').User;
}
