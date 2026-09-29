import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <nav class="pagination" aria-label="Pagination">
      <button
        class="btn btn-secondary page-btn"
        [disabled]="currentPage <= 1"
        (click)="onPageChange(currentPage - 1)"
      >
        {{ t.t('pagination.previous') }}
      </button>

      <span class="page-info">
        {{ t.t('pagination.pageOf', { current: currentPage, total: totalPages }) }}
        <span class="total-count">{{ t.t('pagination.results', { count: totalResults }) }}</span>
      </span>

      <button
        class="btn btn-secondary page-btn"
        [disabled]="currentPage >= totalPages"
        (click)="onPageChange(currentPage + 1)"
      >
        {{ t.t('pagination.next') }}
      </button>
    </nav>
  `,
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly t = inject(TranslationService);

  @Input({ required: true }) currentPage = 1;
  @Input({ required: true }) totalResults = 0;
  @Input() perPage = 30;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.perPage));
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
