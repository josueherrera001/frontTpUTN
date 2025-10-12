import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
   const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirige al login con la URL solicitadacd bac
  return router.createUrlTree(['/auth'], {
    queryParams: { returnUrl: state.url },
  });
};
