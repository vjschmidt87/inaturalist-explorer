import { Component, ChangeDetectionStrategy, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ObservationService } from '@core/services/observation.service';
import { Observation, ObservationSearchParams } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { ObservationCardComponent } from '../../components/observation-card/observation-card.component';
import { ObservationFiltersComponent } from '../../components/observation-filters/observation-filters.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { BehaviorSubject, combineLatest, switchMap, finalize } from 'rxjs';

@Component({
  selector: 'app-observation-list',
  standalone: true,
  imports: [
    ObservationCardComponent,
    ObservationFiltersComponent,
    PaginationComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
  ],
  template: `
    <div class="observation-list-page">
      <h1 class="page-title">{{ t.t('observations.title') }}</h1>

      <app-observation-filters (filtersChange)="onFiltersChange($event)" />

      @if (loading) {
        <app-loading-spinner [message]="t.t('loading.searchingObservations')" />
      } @else if (error) {
        <app-error-message [message]="error" (retry)="refresh()" />
      } @else if (observations.length === 0) {
        <div class="empty-state">
          <h2>{{ t.t('observations.noResults') }}</h2>
          <p>{{ t.t('observations.noResultsHint') }}</p>
        </div>
      } @else {
        <p class="results-count">{{ t.t('observations.count', { count: totalResults }) }}</p>
        <div class="observation-grid">
          @for (obs of observations; track obs.id) {
            <app-observation-card [observation]="obs" />
          }
        </div>
        <app-pagination
          [currentPage]="currentPage"
          [totalResults]="totalResults"
          [perPage]="perPage"
          (pageChange)="onPageChange($event)"
        />
      }
    </div>
  `,
  styleUrl: './observation-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationListComponent implements OnInit {
  private readonly observationService = inject(ObservationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly t = inject(TranslationService);

  observations: Observation[] = [];
  totalResults = 0;
  currentPage = 1;
  perPage = 30;
  loading = true;
  error: string | null = null;

  private filters$ = new BehaviorSubject<Partial<ObservationSearchParams>>({});
  private page$ = new BehaviorSubject<number>(1);

  ngOnInit(): void {
    combineLatest([this.filters$, this.page$])
      .pipe(
        switchMap(([filters, page]) => {
          this.loading = true;
          this.error = null;
          const params: ObservationSearchParams = {
            ...filters,
            page,
            per_page: this.perPage,
            photos: true,
            order: 'desc',
          };
          return this.observationService
            .search(params)
            .pipe(finalize(() => (this.loading = false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          this.observations = response.results;
          this.totalResults = response.total_results;
          this.currentPage = response.page;
        },
        error: (err) => (this.error = err.message),
      });
  }

  onFiltersChange(filters: Partial<ObservationSearchParams>): void {
    this.page$.next(1);
    this.filters$.next(filters);
  }

  onPageChange(page: number): void {
    this.page$.next(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  refresh(): void {
    this.page$.next(this.currentPage);
  }
}
