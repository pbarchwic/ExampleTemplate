import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeviceType } from '@app/core';
import * as Pages from './pages';
import * as Components from './components';
import * as Resolvers from './resolvers';

const DeviceDetailsRoutes: Routes = [
  {
    path: ':id',
    component: Components.DeviceLayoutComponent,
    data: {
      showInBreadcrumbs: false,
      skipTracking: false
    },
    resolve: {
      device: Resolvers.DeviceResolver
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'details'
      },
      {
        path: 'details',
        component: Pages.DeviceDetailsComponent,
        data: {
          title: 'device_details',
          showInBreadcrumbs: false,
          skipTracking: false
        }
      },
      {
        path: 'users',
        component: Pages.DeviceUsersComponent,
        data: {
          title: 'device_users',
          showInBreadcrumbs: false,
          skipTracking: false
        }
      },
      {
        path: 'activities',
        component: Pages.DeviceActivitiesComponent,
        data: {
          title: 'device_activities',
          showInBreadcrumbs: false,
          skipTracking: false
        }
      }
    ]
  }
];

export const DevicesRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild([
    {
        path: '',
        data: {
          title: 'devices',
          showInBreadcrumbs: true,
          skipTracking: false
        },
        children: [
          {
            path: '',
            component: Components.DevicesLayoutComponent,
            data: {
              showInBreadcrumbs: false,
              skipTracking: false
            },
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all',
              },
              {
                path: 'all',
                component: Pages.DevicesAllComponent,
                data: {
                  title: 'devices_all',
                  showInBreadcrumbs: false,
                  skipTracking: false
                }
              },
              {
                path: 'locks',
                component: Pages.DevicesLocksComponent,
                data: {
                  title: 'devices_locks',
                  showInBreadcrumbs: false,
                  skipTracking: false
                }
              },
              {
                path: 'bridges',
                component: Pages.DevicesBridgesComponent,
                data: {
                  title: 'devices_bridges',
                  showInBreadcrumbs: false,
                  skipTracking: false
                }
              }
            ]
          },
          {
            path: 'lock',
            data: {
              deviceType: DeviceType.Lock,
              showInBreadcrumbs: false,
              skipTracking: false
            },
            children: DeviceDetailsRoutes
          },
          {
            path: 'bridge',
            data: {
              deviceType: DeviceType.Bridge,
              showInBreadcrumbs: false,
              skipTracking: false
            },
            children: DeviceDetailsRoutes
          }
        ],
    }
]);
