import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GeneralModule, SidebarModule, FormsModule, IconsModule, GrantPermissionModule } from '@app/shared';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PermissionsRoutes } from './permissions.routes';
import { OverlayModule } from '@angular/cdk/overlay';

import * as Pages from './pages';
import * as Components from './components';
import * as Services from './services';

@NgModule({
  imports: [
    CommonModule,
    PermissionsRoutes,
    GeneralModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    IconsModule,
    InfiniteScrollModule,
    CdkScrollableModule,
    SidebarModule,
    GrantPermissionModule,
    OverlayModule,
    FormsModule
  ],
  declarations: [
    Pages.PermissionsComponent,
    Components.PermissionsLayoutComponent,
    Components.DeviceBarComponent,
    Components.UserBarComponent,
    Components.PermissionMatrixComponent,
    Components.PermissionNotFoundComponent,
    Components.VerticalBarComponent,
    Components.PermissionShareComponent,
    Components.PermissionShareDetailsComponent,
  ],
  providers: [Services.MatrixService],
})
export class PermissionsModule {}
