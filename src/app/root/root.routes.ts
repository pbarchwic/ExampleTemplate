import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, ConsentGuard } from '@app/core';

import * as Components from './components';
import * as Resolvers from './resolvers';

export const RootRoutes: ModuleWithProviders<RouterModule> = RouterModule.forRoot([
  {
    path: '',
    component: Components.LayoutComponent,
    canActivate: [AuthGuard, ConsentGuard],
    resolve: {
      user: Resolvers.UserResolver,
    },
    children: [
      {
        path: '',
        loadChildren: () => import('../organizations/organizations.module').then((m) => m.OrganizationsModule),
        resolve: {
          organizationClear: Resolvers.OrganizationClearResolver,
        },
      },
      {
        path: ':organizationSlug',
        resolve: {
          organization: Resolvers.OrganizationResolver,
        },
        data: {
          skipTracking: true
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'permissions',
          },
          {
            path: 'dashboard',
            loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
            data: {
              skipTracking: false
            }
          },
          {
            path: 'permissions',
            loadChildren: () => import('../permissions/permissions.module').then((m) => m.PermissionsModule),
            data: {
              skipTracking: false
            }
          },
          {
            path: 'users',
            loadChildren: () => import('../users/users.module').then((m) => m.UsersModule),
            data: {
              skipTracking: false
            }
          },
          {
            path: 'devices',
            loadChildren: () => import('../devices/devices.module').then((m) => m.DevicesModule),
            data: {
              skipTracking: false
            }
          },
          {
            path: 'alerts',
            loadChildren: () => import('../alerts/alerts.module').then((m) => m.AlertsModule),
            data: {
              skipTracking: false
            }
          },
          {
            path: 'settings',
            loadChildren: () => import('../settings/settings.module').then((m) => m.SettingsModule),
            data: {
              skipTracking: false
            }
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
]);
