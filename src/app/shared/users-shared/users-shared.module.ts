import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import * as Components from './components';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [Components.UsersNotFoundComponent],
  exports: [Components.UsersNotFoundComponent],
})
export class UserSharedModule {}
