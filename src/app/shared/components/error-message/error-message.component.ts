import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    <div class="error-container">
      <div class="error-icon">!</div>
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-text">{{ message }}</p>
      @if (retryable) {
        <button class="btn btn-primary retry-btn" (click)="retry.emit()">
          {{ t.t('error.tryAgain') }}
        </button>
      }
    </div>
  `,
  styleUrl: './error-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  readonly t = inject(TranslationService);

  @Input() title = this.t.t('error.title');
  @Input() message = this.t.t('error.default');
  @Input() retryable = true;
  @Output() retry = new EventEmitter<void>();
}
