import { Routes } from '@angular/router';
import { SignInComponent } from './shared/pages/auth/sign-in/sign-in.component';
import { PanelLayoutComponent } from './shared/layouts/dashboard-layout/panel-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/public/public.routes').then((x) => x.default),
  },
  {
    path: 'system',
    loadChildren: () => import('./features/system/system.routes').then((x) => x.default),
  },
  {
    path: 'auth',
    children: [{ path: 'login', component: SignInComponent, data: { login_context: 'tenant' } }],
  },
];
