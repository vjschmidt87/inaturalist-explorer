import { Component, ChangeDetectionStrategy, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TaxonService } from '@core/services/taxon.service';
import { Taxon } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { SpeciesCardComponent } from '../../components/species-card/species-card.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, switchMap, debounceTime, distinctUntilChanged, startWith, finalize } from 'rxjs';

@Component({
  selector: 'app-species-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    SpeciesCardComponent,
    PaginationComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
  ],
  template: `
    <div class="species-list-page">
      <h1 class="page-title">{{ t.t('species.title') }}</h1>

      <div class="search-bar">
        <input
          type="text"
          class="search-input"
          [placeholder]="t.t('species.searchPlaceholder')"
          [formControl]="searchControl"
        />
      </div>

      @if (loading) {
        <app-loading-spinner [message]="t.t('loading.searchingSpecies')" />
      } @else if (error) {
        <app-error-message [message]="error" (retry)="refresh()" />
      } @else if (taxa.length === 0) {
        <div class="empty-state">
          <h2>{{ t.t('species.noResults') }}</h2>
          <p>{{ t.t('species.noResultsHint') }}</p>
        </div>
      } @else {
        <p class="results-count">{{ t.t('species.count', { count: totalResults }) }}</p>
        <div class="species-grid">
          @for (taxon of taxa; track taxon.id) {
            <app-species-card [taxon]="taxon" />
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
  styleUrl: './species-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesListComponent implements OnInit {
  private readonly taxonService = inject(TaxonService);
  private readonly destroyRef = inject(DestroyRef);
  readonly t = inject(TranslationService);

  taxa: Taxon[] = [];
  totalResults = 0;
  currentPage = 1;
  perPage = 30;
  loading = true;
  error: string | null = null;

  searchControl = new FormControl('', { nonNullable: true });
  private page$ = new BehaviorSubject<number>(1);

  ngOnInit(): void {
    const search$ = this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith('')
    );

    combineLatest([search$, this.page$])
      .pipe(
        switchMap(([q, page]) => {
          this.loading = true;
          this.error = null;
          return this.taxonService
            .search({
              q: q || undefined,
              is_active: true,
              per_page: this.perPage,
              page,
              order_by: 'observations_count',
              order: 'desc',
            })
            .pipe(finalize(() => (this.loading = false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          this.taxa = response.results;
          this.totalResults = response.total_results;
          this.currentPage = response.page;
        },
        error: (err) => (this.error = err.message),
      });
  }

  onPageChange(page: number): void {
    this.page$.next(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  refresh(): void {
    this.page$.next(this.currentPage);
  }
}
