import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as Pages from './pages';
import * as Components from './components';
import * as Resolvers from './resolvers';

export const UsersRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild([
    {
        path: '',
        component: Components.UsersLayoutComponent,
        data: {
          title: 'users',
          showInBreadcrumbs: true,
          skipTracking: false
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'lists'
          },
          {
            path: 'lists',
            component: Pages.UsersComponent,
            data: {
              title: 'users_lists',
              showInBreadcrumbs: false,
              skipTracking: false
            }
          },
          // {
          //   path: 'groups',
          //   component: Pages.UsersComponent,
          //   data: {
          //     title: 'users_groups',
          //     showInBreadcrumbs: false
          //   }
          // },
        ],
    },
    {
      path: ':userId',
      component: Components.UserLayoutComponent,
      resolve: {
        user: Resolvers.OrganizationUserResolver,
      },
      data: {
        title: 'users',
        showInBreadcrumbs: true,
        skipTracking: true
      },
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'devices',
        },
        // {
        //   path: 'profile',
        //   component: Pages.UserProfileComponent,
        //   data: {
        //     title: 'user_profile',
        //     showInBreadcrumbs: false,
        //     skipTracking: false
        //   }
        // },
        {
          path: 'devices',
          component: Pages.UserDevicesComponent,
          data: {
            title: 'user_devices',
            showInBreadcrumbs: false,
            skipTracking: false
          }
        },
        {
          path: 'activities',
          component: Pages.UserActivitiesComponent,
          data: {
            title: 'user_activities',
            showInBreadcrumbs: false,
            skipTracking: false
          }
        },
      ],
    },
]);
