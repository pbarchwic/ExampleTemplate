import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as Pages from './pages';

export const AlertsRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild([
    {
        path: '',
        component: Pages.AlertsComponent,
        data: {
          title: 'alerts',
          showInBreadcrumbs: true,
          skipTracking: false
        }
    }
]);
