import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiAuthInterceptor } from './shared/interceptors/api-auth.interceptor';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import moment from 'moment';
import { provideJalaliDateAdapter } from './shared/util/JalaliDateAdapter';

moment.locale('fa');
(moment as any).loadPersian?.({ dialect: 'persian-modern', usePersianDigits: true });

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([apiAuthInterceptor])),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideJalaliDateAdapter(),
  ],
};
