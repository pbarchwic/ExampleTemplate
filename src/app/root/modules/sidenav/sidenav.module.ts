import { IconsModule } from '@app/shared/icons';
import { GeneralModule } from '@app/shared/general/general.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

import * as Components from './components';
import * as Services from './services';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    GeneralModule,
    IconsModule,
    MatListModule,
    MatSidenavModule,
    MatExpansionModule
  ],
  declarations: [
    Components.SidenavComponent,
    Components.MenuFullComponent,
    Components.MenuMobileComponent,
    Components.MenuCollapsedComponent,
    Components.OrganizationInfoComponent
  ],
  providers: [
    Services.SidenavService
  ],
  exports: [
    Components.SidenavComponent
  ]
})
export class SidenavModule {}
