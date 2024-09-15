import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DeviceType } from '@app/core';
import * as Pages from './pages';
import * as Components from './components';

export const PermissionsRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild([
  {
    path: '',
    component: Components.PermissionsLayoutComponent,
    data: {
      title: 'permissions',
      showInBreadcrumbs: true,
      skipTracking: false
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'locks',
      },
      {
        path: 'locks',
        component: Pages.PermissionsComponent,
        data: {
          title: 'permissions_locks',
          deviceType: DeviceType.Lock,
          showInBreadcrumbs: false,
          skipTracking: false
        }
      },
      {
        path: 'bridges',
        component: Pages.PermissionsComponent,
        data: {
          title: 'permissions_bridges',
          deviceType: DeviceType.Bridge,
          showInBreadcrumbs: false,
          skipTracking: false
        }
      },
    ],
  },
]);
