import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as Pages from './pages';

export const DashboardRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild([
    {
        path: '',
        component: Pages.DashboardComponent,
        data: {
          title: 'dashboard',
          showInBreadcrumbs: true,
          skipTracking: false
        }
    }
]);
