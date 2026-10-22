import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import moment from 'moment';
import { provideJalaliDateAdapter } from './shared/util/JalaliDateAdapter';

moment.locale('fa');
(moment as any).loadPersian?.({ dialect: 'persian-modern', usePersianDigits: true });

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy:'always'
      })
    ),
        provideJalaliDateAdapter(),


  ]
};
