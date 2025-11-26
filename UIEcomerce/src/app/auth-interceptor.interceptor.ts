import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'shared/services/task.service';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

   const taskservice = inject(TaskService);
  const token = taskservice.getJwtToken();
  const router = inject(Router);

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }
  // if(!req.url.includes('menus') && !req.url.includes('products'))
  //   router.navigate(['/auth']);
  return next(req);
};
