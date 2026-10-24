import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiAuthInterceptor } from './shared/interceptors/api-auth.interceptor';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import moment from 'moment';
import { environment } from '../environments/environment';
import { TenantContextService } from './shared/services/tenant-context.service';
import { provideJalaliDateAdapter } from './shared/util/JalaliDateAdapter';

moment.locale('fa');
(moment as any).loadPersian?.({ dialect: 'persian-modern', usePersianDigits: true });

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Resolve trusted tenant branding/context before rendering a tenant-host login.
    // Never resolve a tenant for marketing or platform-admin routes on the root domain.
    provideAppInitializer(() => {
      const host = window.location.hostname.toLowerCase();
      const suffix = '.' + environment.workspaceBaseDomain.toLowerCase();
      const slug = host.endsWith(suffix) ? host.slice(0, -suffix.length) : '';
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return;
      return inject(TenantContextService).initialize();
    }),
    provideHttpClient(withInterceptors([apiAuthInterceptor])),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideJalaliDateAdapter(),
  ],
};
