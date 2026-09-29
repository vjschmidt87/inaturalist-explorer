import { Component, ChangeDetectionStrategy, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observation, getPhotoUrl } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-observation-card',
  standalone: true,
  imports: [RouterLink, TimeAgoPipe],
  template: `
    <a [routerLink]="['/observations', observation.id]" class="card-link">
      <div class="card-image">
        @if (observation.photos.length > 0) {
          <img
            [src]="getPhotoUrl(observation.photos[0], 'medium')"
            [alt]="observation.species_guess || t.t('observations.unknown')"
            loading="lazy"
          />
        } @else {
          <div class="no-image">{{ t.t('observations.noPhoto') }}</div>
        }
        <span class="quality-badge badge-{{ gradeClass(observation.quality_grade) }}">
          {{ formatGrade(observation.quality_grade) }}
        </span>
        @if (observation.photos.length > 1) {
          <span class="photo-count">{{ observation.photos.length }}</span>
        }
      </div>
      <div class="card-body">
        <h3 class="species-name">
          {{ observation.species_guess || t.t('observations.unknown') }}
        </h3>
        @if (observation.taxon) {
          <p class="scientific-name">{{ observation.taxon.name }}</p>
        }
        <div class="card-meta">
          <img
            [src]="observation.user.icon_url || observation.user.icon || 'assets/default-avatar.svg'"
            [alt]="observation.user.login"
            class="user-avatar"
          />
          <span class="user-name">{{ observation.user.login }}</span>
          <span class="separator">·</span>
          <span class="date">{{ observation.observed_on | timeAgo }}</span>
        </div>
        @if (observation.place_guess) {
          <p class="place">{{ observation.place_guess }}</p>
        }
        <div class="card-stats">
          <span class="stat" [title]="t.t('detail.identifications')">
            🔍 {{ observation.identifications_count }}
          </span>
          <span class="stat" [title]="t.t('detail.comments')">
            💬 {{ observation.comments_count }}
          </span>
          <span class="stat" [title]="t.t('detail.favorites')">
            ⭐ {{ observation.faves_count }}
          </span>
        </div>
      </div>
    </a>
  `,
  styleUrl: './observation-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationCardComponent {
  readonly t = inject(TranslationService);

  @Input({ required: true }) observation!: Observation;

  readonly getPhotoUrl = getPhotoUrl;

  formatGrade(grade: string): string {
    const key = grade === 'needs_id' ? 'quality.needsId' : grade === 'research' ? 'quality.research' : 'quality.casual';
    return this.t.t(key);
  }

  gradeClass(grade: string): string {
    return grade.replace('_', '-');
  }
}
