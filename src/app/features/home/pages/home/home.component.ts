import { Component, ChangeDetectionStrategy, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ObservationService } from '@core/services/observation.service';
import { Observation } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';
import { getPhotoUrl } from '@core/models';
import { BehaviorSubject, switchMap, finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    TimeAgoPipe,
  ],
  template: `
    <div class="home">
      <section class="hero">
        <h1 class="hero-title">{{ t.t('home.heroTitle') }}</h1>
        <p class="hero-subtitle">
          {{ t.t('home.heroSubtitle') }}
        </p>
        <div class="hero-actions">
          <a routerLink="/observations" class="btn btn-primary btn-lg">
            {{ t.t('home.browseObservations') }}
          </a>
          <a routerLink="/explore" class="btn btn-secondary btn-lg">
            {{ t.t('home.exploreMap') }}
          </a>
        </div>
      </section>

      <section class="recent-section">
        <div class="section-header">
          <h2 class="section-title">{{ t.t('home.recentTitle') }}</h2>
          <a routerLink="/observations" class="view-all">{{ t.t('home.viewAll') }}</a>
        </div>

        @if (loading) {
          <app-loading-spinner [message]="t.t('loading.recentObservations')" />
        } @else if (error) {
          <app-error-message
            [message]="error"
            (retry)="loadRecent$.next()"
          />
        } @else {
          <div class="observation-grid">
            @for (obs of recentObservations; track obs.id) {
              <a [routerLink]="['/observations', obs.id]" class="obs-card">
                <div class="obs-image">
                  @if (obs.photos.length > 0) {
                    <img [src]="getPhotoUrl(obs.photos[0], 'medium')" [alt]="obs.species_guess || t.t('observations.unknown')" />
                  } @else {
                    <div class="no-image">{{ t.t('observations.noPhoto') }}</div>
                  }
                  <span class="quality-badge badge-{{ gradeClass(obs.quality_grade) }}">
                    {{ formatQualityGrade(obs.quality_grade) }}
                  </span>
                </div>
                <div class="obs-info">
                  <h3 class="obs-name">{{ obs.species_guess || t.t('observations.unknown') }}</h3>
                  @if (obs.taxon?.preferred_common_name && obs.taxon?.preferred_common_name !== obs.species_guess) {
                    <p class="obs-scientific">{{ obs.taxon?.name }}</p>
                  }
                  <p class="obs-meta">
                    <span class="obs-user">{{ obs.user.login }}</span>
                    <span class="obs-date">{{ obs.observed_on | timeAgo }}</span>
                  </p>
                  @if (obs.place_guess) {
                    <p class="obs-place">{{ obs.place_guess }}</p>
                  }
                </div>
              </a>
            }
          </div>
        }
      </section>

      <section class="features-section">
        <div class="feature-cards">
          <a routerLink="/observations" class="feature-card">
            <div class="feature-icon">📷</div>
            <h3>{{ t.t('home.featureObservationsTitle') }}</h3>
            <p>{{ t.t('home.featureObservationsDesc') }}</p>
          </a>
          <a routerLink="/species" class="feature-card">
            <div class="feature-icon">🧬</div>
            <h3>{{ t.t('home.featureSpeciesTitle') }}</h3>
            <p>{{ t.t('home.featureSpeciesDesc') }}</p>
          </a>
          <a routerLink="/explore" class="feature-card">
            <div class="feature-icon">🗺️</div>
            <h3>{{ t.t('home.featureMapTitle') }}</h3>
            <p>{{ t.t('home.featureMapDesc') }}</p>
          </a>
        </div>
      </section>
    </div>
  `,
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly observationService = inject(ObservationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly t = inject(TranslationService);

  recentObservations: Observation[] = [];
  loading = true;
  error: string | null = null;

  loadRecent$ = new BehaviorSubject<void>(undefined);

  readonly getPhotoUrl = getPhotoUrl;

  ngOnInit(): void {
    this.loadRecent$
      .pipe(
        switchMap(() => {
          this.loading = true;
          this.error = null;
          return this.observationService
            .search({
              per_page: 12,
              order_by: 'created_at',
              order: 'desc',
              photos: true,
              quality_grade: 'research',
            })
            .pipe(finalize(() => (this.loading = false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => (this.recentObservations = response.results),
        error: (err) => (this.error = err.message),
      });
  }

  formatQualityGrade(grade: string): string {
    const key = grade === 'needs_id' ? 'quality.needsId' : grade === 'research' ? 'quality.research' : 'quality.casual';
    return this.t.t(key);
  }

  gradeClass(grade: string): string {
    return grade.replace('_', '-');
  }
}
