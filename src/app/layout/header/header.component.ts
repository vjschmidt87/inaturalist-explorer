import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService, Lang } from '@core/i18n/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header-inner">
        <a routerLink="/" class="logo">
          <span class="logo-icon">🌿</span>
          <span class="logo-text">{{ t.t('header.logo') }}</span>
        </a>
        <nav class="nav">
          <a
            routerLink="/observations"
            routerLinkActive="active"
            class="nav-link"
          >
            {{ t.t('header.observations') }}
          </a>
          <a
            routerLink="/species"
            routerLinkActive="active"
            class="nav-link"
          >
            {{ t.t('header.species') }}
          </a>
          <a
            routerLink="/explore"
            routerLinkActive="active"
            class="nav-link"
          >
            {{ t.t('header.exploreMap') }}
          </a>
          <button
            class="lang-toggle"
            (click)="toggleLang()"
            [title]="t.currentLang() === 'en' ? 'Mudar para Português' : 'Switch to English'"
          >
            {{ t.currentLang() === 'en' ? 'PT-BR' : 'EN' }}
          </button>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly t = inject(TranslationService);

  toggleLang(): void {
    const next: Lang = this.t.currentLang() === 'en' ? 'pt-br' : 'en';
    this.t.setLang(next);
  }
}
