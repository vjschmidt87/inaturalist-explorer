import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';

@Pipe({ name: 'timeAgo', standalone: true, pure: false })
export class TimeAgoPipe implements PipeTransform {
  private readonly t = inject(TranslationService);

  transform(value: string | null): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: [number, string, string][] = [
      [31536000, 'timeAgo.year', 'timeAgo.years'],
      [2592000, 'timeAgo.month', 'timeAgo.months'],
      [86400, 'timeAgo.day', 'timeAgo.days'],
      [3600, 'timeAgo.hour', 'timeAgo.hours'],
      [60, 'timeAgo.minute', 'timeAgo.minutes'],
    ];

    for (const [secondsInUnit, singularKey, pluralKey] of intervals) {
      const count = Math.floor(seconds / secondsInUnit);
      if (count >= 1) {
        const unit = this.t.t(count === 1 ? singularKey : pluralKey);
        return this.t.t('timeAgo.ago', { value: count, unit });
      }
    }

    return this.t.t('timeAgo.justNow');
  }
}
