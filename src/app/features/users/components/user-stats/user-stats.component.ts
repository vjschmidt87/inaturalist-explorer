import { Component, ChangeDetectionStrategy, Input, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UserDetail } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">{{ user.observations_count | number }}</span>
        <span class="stat-label">{{ t.t('user.observations') }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ user.species_count | number }}</span>
        <span class="stat-label">{{ t.t('user.species') }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ user.identifications_count | number }}</span>
        <span class="stat-label">{{ t.t('user.identifications') }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ user.journal_posts_count | number }}</span>
        <span class="stat-label">{{ t.t('user.journalPosts') }}</span>
      </div>
    </div>
  `,
  styleUrl: './user-stats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserStatsComponent {
  readonly t = inject(TranslationService);

  @Input({ required: true }) user!: UserDetail;
}
