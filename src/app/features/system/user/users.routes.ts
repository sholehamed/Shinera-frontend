import { Routes } from '@angular/router';

// System user creation/update are intentionally unavailable pending a safe
// backend System-only identity contract. Existing handler currently forces
// an invalid Master TenantId and always resets the password on update.
export default [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list.component')
      .then(x => x.UserListComponent),
    data: { breadcrumb: 'کاربران سیستم' },
  },
  { path: '**', redirectTo: '' },
] as Routes;
