import { Component, ChangeDetectionStrategy, Output, EventEmitter, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ObservationSearchParams, QualityGrade } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-observation-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="filters">
      <div class="filter-row">
        <div class="filter-group search-group">
          <label class="filter-label" for="search">{{ t.t('filters.search') }}</label>
          <input
            id="search"
            type="text"
            class="filter-input"
            [placeholder]="t.t('filters.searchPlaceholder')"
            [formControl]="filterForm.controls.q"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label" for="taxonName">{{ t.t('filters.species') }}</label>
          <input
            id="taxonName"
            type="text"
            class="filter-input"
            [placeholder]="t.t('filters.speciesPlaceholder')"
            [formControl]="filterForm.controls.taxon_name"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label" for="quality">{{ t.t('filters.qualityGrade') }}</label>
          <select
            id="quality"
            class="filter-select"
            [formControl]="filterForm.controls.quality_grade"
          >
            <option value="">{{ t.t('filters.allGrades') }}</option>
            <option value="research">{{ t.t('filters.researchGrade') }}</option>
            <option value="needs_id">{{ t.t('filters.needsId') }}</option>
            <option value="casual">{{ t.t('filters.casual') }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label" for="orderBy">{{ t.t('filters.sortBy') }}</label>
          <select
            id="orderBy"
            class="filter-select"
            [formControl]="filterForm.controls.order_by"
          >
            <option value="created_at">{{ t.t('filters.dateCreated') }}</option>
            <option value="observed_on">{{ t.t('filters.dateObserved') }}</option>
            <option value="votes">{{ t.t('filters.popularity') }}</option>
          </select>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-group">
          <label class="filter-label" for="dateFrom">{{ t.t('filters.from') }}</label>
          <input
            id="dateFrom"
            type="date"
            class="filter-input"
            [formControl]="filterForm.controls.d1"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label" for="dateTo">{{ t.t('filters.to') }}</label>
          <input
            id="dateTo"
            type="date"
            class="filter-input"
            [formControl]="filterForm.controls.d2"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label" for="user">{{ t.t('filters.observer') }}</label>
          <input
            id="user"
            type="text"
            class="filter-input"
            [placeholder]="t.t('filters.usernamePlaceholder')"
            [formControl]="filterForm.controls.user_login"
          />
        </div>

        <div class="filter-group filter-actions">
          <button class="btn-reset" (click)="resetFilters()">
            {{ t.t('filters.clear') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './observation-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationFiltersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  readonly t = inject(TranslationService);

  @Output() filtersChange = new EventEmitter<Partial<ObservationSearchParams>>();

  filterForm = this.fb.nonNullable.group({
    q: [''],
    taxon_name: [''],
    quality_grade: ['' as QualityGrade | ''],
    order_by: ['created_at' as ObservationSearchParams['order_by']],
    d1: [''],
    d2: [''],
    user_login: [''],
  });

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((values) => {
        const params: Partial<ObservationSearchParams> = {};
        Object.entries(values).forEach(([key, value]) => {
          if (value) {
            (params as Record<string, unknown>)[key] = value;
          }
        });
        this.filtersChange.emit(params);
      });
  }

  resetFilters(): void {
    this.filterForm.reset({
      q: '',
      taxon_name: '',
      quality_grade: '',
      order_by: 'created_at',
      d1: '',
      d2: '',
      user_login: '',
    });
  }
}
