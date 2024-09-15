import { NgModule } from '@angular/core';

import * as Guards from './guards';
import * as Contexts from './contexts';
import * as Repositories from './repositories';
import * as Services from './services';

@NgModule({
  providers: [
    Repositories.UserRepository,
    Repositories.OrganizationsRepository,
    Repositories.FileRepository,
    Repositories.DeviceShareRepository,
    Repositories.PermissionsRepository,
    Repositories.DevicesRepository,
    Repositories.UsersRepository,
    Services.StorageService,
    Services.AuthService,
    Services.ConfigService,
    Services.OrganizationService,
    Services.AppInsightsService,
    Services.ConsentService,
    Services.LanguagesService,
    Guards.AuthGuard,
    Guards.ConsentGuard,
    Contexts.UserContext,
    Contexts.SidenavContext,
    Contexts.OrganizationContext,
  ],
})
export class CoreModule {}
