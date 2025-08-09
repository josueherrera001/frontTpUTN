import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ErrorResponseInterceptor } from 'shared/interceptor/error-response.interceptor';
import { provideToastr } from 'ngx-toastr';
import { SpinnerInterceptor } from 'shared/interceptor/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr({
      timeOut:900,
      preventDuplicates:true
    }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(),
    withInterceptors([ErrorResponseInterceptor, SpinnerInterceptor])),    
  ]
};
