import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <p class="footer-text">
          {{ t.t('footer.poweredBy') }}
          <a href="https://api.inaturalist.org/v1/docs/" target="_blank" rel="noopener noreferrer">
            iNaturalist API
          </a>
        </p>
        <p class="footer-disclaimer">
          {{ t.t('footer.disclaimer') }}
        </p>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly t = inject(TranslationService);
}
