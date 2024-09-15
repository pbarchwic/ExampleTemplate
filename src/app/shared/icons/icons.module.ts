import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import * as Services from './services';

@NgModule({
  imports: [
    MatIconModule
  ],
  providers: [
    Services.IconsService
  ],
  exports: [
    MatIconModule
  ]
})
export class IconsModule {}
