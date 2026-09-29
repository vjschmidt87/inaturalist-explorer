import { Component, ChangeDetectionStrategy, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Taxon, getPhotoUrl } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-species-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/species', taxon.id]" class="species-link">
      <div class="species-image">
        @if (taxon.default_photo) {
          <img
            [src]="getPhotoUrl(taxon.default_photo, 'medium')"
            [alt]="taxon.preferred_common_name || taxon.name"
            loading="lazy"
          />
        } @else {
          <div class="no-image">🌿</div>
        }
        @if (taxon.iconic_taxon_name) {
          <span class="iconic-badge">{{ taxon.iconic_taxon_name }}</span>
        }
      </div>
      <div class="species-info">
        <h3 class="common-name">
          {{ taxon.preferred_common_name || taxon.name }}
        </h3>
        <p class="scientific-name">{{ taxon.name }}</p>
        <div class="species-meta">
          <span class="rank-badge">{{ taxon.rank }}</span>
          <span class="obs-count">{{ t.t('species.observations', { count: formatNumber(taxon.observations_count) }) }}</span>
        </div>
      </div>
    </a>
  `,
  styleUrl: './species-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesCardComponent {
  readonly t = inject(TranslationService);

  @Input({ required: true }) taxon!: Taxon;

  readonly getPhotoUrl = getPhotoUrl;

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}
