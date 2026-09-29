import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { TranslationService } from '@core/i18n/translation.service';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api/')) {
    const translationService = inject(TranslationService);
    const params = req.params.set('locale', translationService.apiLocale);
    const apiReq = req.clone({
      url: `${environment.apiBaseUrl}${req.url.substring(4)}`,
      params,
    });
    return next(apiReq);
  }
  return next(req);
};
