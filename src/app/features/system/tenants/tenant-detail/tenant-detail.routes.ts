import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./tenant-detail.component').then(x => x.TenantDetailComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },

      {
        path: 'overview',
        loadComponent: () =>
          import('./tenant-overview/tenant-overview.component').then(x => x.TenantOverviewComponent),
        data: { breadcrumb: 'نمای کلی' }
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./tenant-users/tenant-users.component').then(x => x.TenantUsersComponent),
        data: { breadcrumb: 'کاربران' }
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./tenant-roles/tenant-roles.component').then(x => x.TenantRolesComponent),
        data: { breadcrumb: 'نقش‌ها' }
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./tenant-groups/tenant-groups.component').then(x => x.TenantGroupsComponent),
        data: { breadcrumb: 'گروه‌ها' }
      },
      {
        path: 'permissions',
        loadComponent: () =>
          import('./tenant-permissions/tenant-permissions.component').then(x => x.TenantPermissionsComponent),
        data: { breadcrumb: 'مجوزها' }
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./tenant-settings/tenant-settings.component').then(x => x.TenantSettingsComponent),
        data: { breadcrumb: 'تنظیمات' }
      }
    ]
  }
] as Routes;
