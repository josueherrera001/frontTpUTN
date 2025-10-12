import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  /*Obtain the required roles from route data*/
  const requiredRoles = route.data['roles'] as Array<string>;
  /* If no roles are required, allow access */
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  /* Check if the user has at least one of the required roles */
  // const userRoles = JSON.parse(localStorage.getItem('RoleUser') || '[]') as Array<string>;
  // const hasRole = userRoles.some(role => requiredRoles.includes(role));
  const hasRole = auth.hasAnyRole( requiredRoles );
  if (!hasRole) {
    // Optionally, redirect to an unauthorized page or show a message
    router.navigate(['/unauthorized']);
    return false; // Deny access if the user lacks the required roles
  }
  return true;
};
