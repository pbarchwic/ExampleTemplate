import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { FormsModule, GeneralModule, UserSharedModule } from '@app/shared';

import { SettingsRoutes } from './settings.routes';
import * as Pages from './pages';
import * as Components from './components';
import * as Modals from './modals';

@NgModule({
  imports: [
    SettingsRoutes,
    CommonModule,
    GeneralModule,
    FormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    UserSharedModule,
  ],
  declarations: [
    Pages.AdministratorsComponent,
    Components.SettingsLayoutComponent,
    Components.AddAdministratorsComponent,
    Modals.DeleteAdministartorComponent,
  ],
})
export class SettingsModule {}
