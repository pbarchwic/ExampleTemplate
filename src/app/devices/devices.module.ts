import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { GeneralModule, IconsModule, SidebarModule, FormsModule } from '@app/shared';

import { DevicesRoutes } from './devices.routes';

import * as Pages from './pages';
import * as Components from './components';
import * as Sidebars from './sidebars';
import * as Modals from './modals';
import * as Services from './services';
import * as Contexts from './contexts';
import * as Resolvers from './resolvers';

@NgModule({
  imports: [
    CommonModule,
    DevicesRoutes,
    GeneralModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    IconsModule,
    InfiniteScrollModule,
    SidebarModule,
    FormsModule,
  ],
  declarations: [
    Pages.DevicesAllComponent,
    Pages.DevicesLocksComponent,
    Pages.DevicesBridgesComponent,
    Pages.DeviceDetailsComponent,
    Pages.DeviceUsersComponent,
    Pages.DeviceActivitiesComponent,
    Components.DeviceLayoutComponent,
    Components.DevicesLayoutComponent,
    Components.DevicesNotFoundComponent,
    Components.DeviceActivitiesNotFoundComponent,
    Components.DeviceUsersNotFoundComponent,
    Sidebars.AddDeviceComponent,
    Modals.DeleteDeviceComponent,
    Modals.AddDeviceConfirmComponent,
    Modals.UnassignDeviceComponent,
  ],
  providers: [
    Contexts.DeviceContext,
    Services.DevicesService,
    Resolvers.DeviceResolver
  ],
})
export class DevicesModule {}
