import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

import { IconsModule } from '../icons';

import * as Components from './components';
import * as Directives from './directives';
import * as Services from './services';

@NgModule({
  imports: [CommonModule, TranslateModule, IconsModule, MatProgressSpinnerModule],
  declarations: [Components.SidebarComponent, Components.SidebarContentComponent, Directives.SidebarContentDirective],
  exports: [Components.SidebarComponent, Components.SidebarContentComponent],
})
export class SidebarModule {
  public static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SidebarModule,
      providers: [Services.SidebarService],
    };
  }
}
