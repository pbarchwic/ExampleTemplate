import { FormsModule } from './../forms/forms.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { GeneralModule } from '../general';
import { SidebarModule } from '../sidebar';

import * as Components from './components';

@NgModule({
  imports: [CommonModule, GeneralModule, TranslateModule, SidebarModule, FormsModule],
  declarations: [Components.AddPermissionComponent, Components.DeletePermissionComponent],
  exports: [Components.AddPermissionComponent, Components.DeletePermissionComponent],
})
export class GrantPermissionModule {}
