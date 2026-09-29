import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      if (error.status === 0) {
        message = 'Unable to connect to the iNaturalist API. Please check your network connection.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.status === 429) {
        message = 'Too many requests. Please wait a moment and try again.';
      } else if (error.status >= 500) {
        message = 'The iNaturalist API is experiencing issues. Please try again later.';
      }

      return throwError(() => ({ status: error.status, message }));
    })
  );
};
