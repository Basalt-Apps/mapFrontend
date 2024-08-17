import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { TokenService } from '../auth/services/token.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const url = environment.backendUrl;

  return tokenService.getToken().pipe(
    switchMap((token: string | null): Observable<HttpEvent<unknown>> => {
      return next(
        req.clone({
          url: `${url}${req.url}`,
          headers: token
            ? req.headers.set('authorization', 'Bearer ' + token)
            : req.headers,
        }),
      );
    }),
  );
};
