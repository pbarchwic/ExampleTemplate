import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { GeneralModule, IconsModule, SidebarModule, FormsModule, UserSharedModule } from '@app/shared';

import { UsersRoutes } from './users.routes';

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
    UsersRoutes,
    GeneralModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    IconsModule,
    SidebarModule,
    FormsModule,
    InfiniteScrollModule,
    UserSharedModule,
  ],
  declarations: [
    Components.UsersLayoutComponent,
    Components.UserLayoutComponent,
    Components.UserDevicesNotFoundComponent,
    Components.UserActivitiesNotFoundComponent,
    Pages.UsersComponent,
    Pages.UserProfileComponent,
    Pages.UserDevicesComponent,
    Pages.UserActivitiesComponent,
    Sidebars.AddUserComponent,
    Modals.DeleteUserComponent,
  ],
  providers: [Resolvers.OrganizationUserResolver, Contexts.OrganizationUserContext, Services.UsersService],
})
export class UsersModule {}
