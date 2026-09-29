import { Component, ChangeDetectionStrategy, DestroyRef, inject, OnInit, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ObservationService } from '@core/services/observation.service';
import { Observation } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { PhotoGalleryComponent } from '@shared/components/photo-gallery/photo-gallery.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';
import { BehaviorSubject, switchMap, filter, finalize } from 'rxjs';

@Component({
  selector: 'app-observation-detail',
  standalone: true,
  imports: [
    RouterLink,
    PhotoGalleryComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    TimeAgoPipe,
  ],
  template: `
    @if (loading) {
      <app-loading-spinner [message]="t.t('loading.observation')" />
    } @else if (error) {
      <app-error-message [message]="error" (retry)="reload()" />
    } @else if (observation) {
      <div class="detail-page">
        <a routerLink="/observations" class="back-link">{{ t.t('detail.back') }}</a>

        <div class="detail-layout">
          <div class="detail-photos">
            <app-photo-gallery [photos]="observation.photos" />
          </div>

          <div class="detail-info">
            <div class="info-card">
              <h1 class="species-name">
                {{ observation.species_guess || t.t('observations.unknown') }}
              </h1>
              @if (observation.taxon) {
                <p class="scientific-name">
                  <a [routerLink]="['/species', observation.taxon.id]">
                    {{ observation.taxon.name }}
                  </a>
                </p>
                @if (observation.taxon.preferred_common_name) {
                  <p class="common-name">{{ observation.taxon.preferred_common_name }}</p>
                }
              }

              <span class="quality-badge badge-{{ gradeClass(observation.quality_grade) }}">
                {{ formatGrade(observation.quality_grade) }}
              </span>
            </div>

            <div class="info-card">
              <h2 class="card-title">{{ t.t('detail.observer') }}</h2>
              <a [routerLink]="['/users', observation.user.login]" class="observer-link">
                <img
                  [src]="observation.user.icon_url || observation.user.icon || 'assets/default-avatar.svg'"
                  [alt]="observation.user.login"
                  class="observer-avatar"
                />
                <div>
                  <span class="observer-name">{{ observation.user.login }}</span>
                  @if (observation.user.name) {
                    <span class="observer-full-name">{{ observation.user.name }}</span>
                  }
                </div>
              </a>
            </div>

            <div class="info-card">
              <h2 class="card-title">{{ t.t('detail.details') }}</h2>
              <dl class="details-list">
                <div class="detail-item">
                  <dt>{{ t.t('detail.observed') }}</dt>
                  <dd>{{ observation.observed_on_string || (observation.observed_on | timeAgo) }}</dd>
                </div>
                @if (observation.place_guess) {
                  <div class="detail-item">
                    <dt>{{ t.t('detail.location') }}</dt>
                    <dd>{{ observation.place_guess }}</dd>
                  </div>
                }
                <div class="detail-item">
                  <dt>{{ t.t('detail.identifications') }}</dt>
                  <dd>{{ observation.identifications_count }}</dd>
                </div>
                <div class="detail-item">
                  <dt>{{ t.t('detail.comments') }}</dt>
                  <dd>{{ observation.comments_count }}</dd>
                </div>
                <div class="detail-item">
                  <dt>{{ t.t('detail.favorites') }}</dt>
                  <dd>{{ observation.faves_count }}</dd>
                </div>
              </dl>
            </div>

            @if (observation.description) {
              <div class="info-card">
                <h2 class="card-title">{{ t.t('detail.description') }}</h2>
                <p class="description">{{ observation.description }}</p>
              </div>
            }

            <div class="info-card">
              <a
                [href]="observation.uri"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-secondary view-on-inat"
              >
                {{ t.t('detail.viewOnINat') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './observation-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationDetailComponent implements OnInit {
  private readonly observationService = inject(ObservationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly t = inject(TranslationService);

  @Input() id!: string;

  observation: Observation | null = null;
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
          return this.observationService
            .getById(id)
            .pipe(finalize(() => (this.loading = false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (obs) => (this.observation = obs),
        error: (err) => (this.error = err.message),
      });
  }

  reload(): void {
    this.id$.next(Number(this.id));
  }

  formatGrade(grade: string): string {
    const key = grade === 'needs_id' ? 'quality.needsId' : grade === 'research' ? 'quality.research' : 'quality.casual';
    return this.t.t(key);
  }

  gradeClass(grade: string): string {
    return grade.replace('_', '-');
  }
}
