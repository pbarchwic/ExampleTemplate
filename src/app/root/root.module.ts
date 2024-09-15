import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { IconsModule, SidebarModule, GeneralModule, FormsModule } from '@app/shared';
import { CoreModule } from '@app/core';

import { RootRoutes } from './root.routes';
import { RootTranslate } from './root.translate';

import * as Modules from './modules';
import * as Components from './components';
import * as Interceptors from './interceptors';
import * as Resolvers from './resolvers';
import * as Modals from './modals';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    LoadingBarRouterModule,
    HttpClientModule,
    MatListModule,
    MatSidenavModule,
    GeneralModule,
    SidebarModule.forRoot(),
    SidebarModule,
    IconsModule,
    FormsModule,
    CoreModule,
    RootRoutes,
    RootTranslate,
    Modules.SidenavModule,
  ],
  declarations: [
    Components.RootComponent,
    Components.RouterTrackingComponent,
    Components.LayoutComponent,
    Components.ToolbarComponent,
    Components.UserMenuComponent,
    Components.BreadcrumbsComponent,
    Modals.ConsentComponent,
  ],
  providers: [
    Interceptors.ApiInterceptor,
    Interceptors.TokenInterceptor,
    Resolvers.UserResolver,
    Resolvers.OrganizationResolver,
    Resolvers.OrganizationClearResolver,
  ],
  bootstrap: [Components.RootComponent],
})
export class RootModule {}
