import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  authService.verify();
  return authService.getLoggedIn();
};
