import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ErrorResponseInterceptor } from 'shared/interceptor/error-response.interceptor';
import { provideToastr } from 'ngx-toastr';
import { SpinnerInterceptor } from 'shared/interceptor/spinner.interceptor';
import { authInterceptorInterceptor } from './auth-interceptor.interceptor';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr({
      timeOut:1200,
      preventDuplicates:true
    }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([ErrorResponseInterceptor,authInterceptorInterceptor, SpinnerInterceptor])
    ),
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },JwtHelperService
  ]
};

