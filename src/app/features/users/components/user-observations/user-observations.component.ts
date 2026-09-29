import { Component, ChangeDetectionStrategy, Input, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ObservationService } from '@core/services/observation.service';
import { Observation } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { ObservationCardComponent } from '@features/observations/components/observation-card/observation-card.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-observations',
  standalone: true,
  imports: [ObservationCardComponent, LoadingSpinnerComponent],
  template: `
    @if (loading) {
      <app-loading-spinner [message]="t.t('loading.observations')" />
    } @else if (observations.length === 0) {
      <p class="no-observations">{{ t.t('user.noObservations') }}</p>
    } @else {
      <div class="observations-grid">
        @for (obs of observations; track obs.id) {
          <app-observation-card [observation]="obs" />
        }
      </div>
    }
  `,
  styleUrl: './user-observations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserObservationsComponent implements OnInit {
  private readonly observationService = inject(ObservationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly t = inject(TranslationService);

  @Input({ required: true }) userLogin!: string;

  observations: Observation[] = [];
  loading = true;

  ngOnInit(): void {
    this.observationService
      .search({
        user_login: this.userLogin,
        per_page: 12,
        order_by: 'created_at',
        order: 'desc',
        photos: true,
      })
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => (this.observations = response.results),
      });
  }
}
