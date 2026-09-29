import { Component, ChangeDetectionStrategy, DestroyRef, inject, OnInit, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TaxonService } from '@core/services/taxon.service';
import { Taxon, getPhotoUrl } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { TaxonomyTreeComponent } from '../../components/taxonomy-tree/taxonomy-tree.component';
import { PhotoGalleryComponent } from '@shared/components/photo-gallery/photo-gallery.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { PhotoExtractPipe } from '@shared/pipes/photo-extract.pipe';
import { BehaviorSubject, switchMap, filter, finalize } from 'rxjs';

@Component({
  selector: 'app-species-detail',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    TaxonomyTreeComponent,
    PhotoGalleryComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    PhotoExtractPipe,
  ],
  template: `
    @if (loading) {
      <app-loading-spinner [message]="t.t('loading.speciesDetails')" />
    } @else if (error) {
      <app-error-message [message]="error" (retry)="reload()" />
    } @else if (taxon) {
      <div class="species-detail-page">
        <a routerLink="/species" class="back-link">{{ t.t('speciesDetail.back') }}</a>

        @if (taxon.ancestors) {
          <app-taxonomy-tree [ancestors]="getAncestorsWithCurrent()" />
        }

        <div class="detail-layout">
          <div class="detail-photos">
            @if (taxon.taxon_photos && taxon.taxon_photos.length > 0) {
              <app-photo-gallery [photos]="taxon.taxon_photos | photoExtract" />
            } @else if (taxon.default_photo) {
              <app-photo-gallery [photos]="[taxon.default_photo]" />
            }
          </div>

          <div class="detail-info">
            <div class="info-card">
              <h1 class="species-name">
                {{ taxon.preferred_common_name || taxon.name }}
              </h1>
              <p class="scientific-name">{{ taxon.name }}</p>
              <div class="badges">
                <span class="rank-badge">{{ taxon.rank }}</span>
                @if (taxon.iconic_taxon_name) {
                  <span class="iconic-badge">{{ taxon.iconic_taxon_name }}</span>
                }
                @if (!taxon.is_active) {
                  <span class="inactive-badge">{{ t.t('speciesDetail.inactive') }}</span>
                }
              </div>
            </div>

            <div class="info-card stats-card">
              <div class="stat">
                <span class="stat-value">{{ taxon.observations_count | number }}</span>
                <span class="stat-label">{{ t.t('speciesDetail.observations') }}</span>
              </div>
            </div>

            @if (taxon.wikipedia_summary) {
              <div class="info-card">
                <h2 class="card-title">{{ t.t('speciesDetail.about') }}</h2>
                <p class="wiki-summary">{{ taxon.wikipedia_summary }}</p>
                @if (taxon.wikipedia_url) {
                  <a
                    [href]="taxon.wikipedia_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="wiki-link"
                  >
                    {{ t.t('speciesDetail.readMoreWiki') }}
                  </a>
                }
              </div>
            }

            @if (taxon.conservation_status) {
              <div class="info-card">
                <h2 class="card-title">{{ t.t('speciesDetail.conservationStatus') }}</h2>
                <div class="conservation">
                  <span class="conservation-status">{{ taxon.conservation_status.status_name }}</span>
                  <span class="conservation-authority">({{ taxon.conservation_status.authority }})</span>
                </div>
              </div>
            }

            <div class="info-card">
              <a
                [routerLink]="['/observations']"
                [queryParams]="{ taxon_id: taxon.id }"
                class="btn btn-primary view-observations"
              >
                {{ t.t('speciesDetail.viewObservations') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './species-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesDetailComponent implements OnInit {
  private readonly taxonService = inject(TaxonService);
  private readonly destroyRef = inject(DestroyRef);
  readonly t = inject(TranslationService);

  @Input() id!: string;

  taxon: Taxon | null = null;
  loading = true;
  error: string | null = null;

  private id$ = new BehaviorSubject<number | null>(null);

  ngOnInit(): void {
    this.id$.next(Number(this.id));

    this.id$
      .pipe(
        filter((id): id is number => id !== null),
        switchMap((id) => {
          this.loading = true;
          this.error = null;
          return this.taxonService
            .getById(id)
            .pipe(finalize(() => (this.loading = false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (taxon) => (this.taxon = taxon),
        error: (err) => (this.error = err.message),
      });
  }

  reload(): void {
    this.id$.next(Number(this.id));
  }

  getAncestorsWithCurrent(): Taxon[] {
    if (this.taxon?.ancestors) {
      return [...this.taxon.ancestors, this.taxon];
    }
    return [];
  }
}
