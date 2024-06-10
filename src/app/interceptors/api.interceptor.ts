import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from "../../environments/environment";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = environment.backendUrl;

  return next(req.clone( { url: `${url}${req.url}` }));
};
