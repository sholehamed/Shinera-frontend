import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../../shared/guards/can-deactivate.guard';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./user-list/user-list.component').then(x => x.UserListComponent),
    data: { breadcrumb: 'کاربران' }
  },
  {
    path: 'create',canDeactivate:[unsavedChangesGuard],
    loadComponent: () =>
      import('./user-form/user-form.component').then(x => x.UserFormComponent),
    data: { breadcrumb: 'کاربر جدید' }
  },
  {
    path: ':userId/edit',canDeactivate:[unsavedChangesGuard],
    loadComponent: () =>
      import('./user-form/user-form.component').then(x => x.UserFormComponent),
    data: { breadcrumb: 'ویرایش کاربر' }
  },
 
] as Routes;
