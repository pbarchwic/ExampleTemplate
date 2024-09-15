import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as Pages from './pages';
import * as Components from './components';

export const SettingsRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild([
  {
    path: '',
    component: Components.SettingsLayoutComponent,
    data: {
      title: 'settings',
      showInBreadcrumbs: true,
      skipTracking: false
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'administartors',
      },
      {
        path: 'administartors',
        component: Pages.AdministratorsComponent,
        data: {
          title: 'organization_administrators',
          showInBreadcrumbs: true,
          skipTracking: false
        },
      },
    ],
  },
]);
