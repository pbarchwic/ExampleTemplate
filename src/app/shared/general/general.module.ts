import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import * as Components from './components';
import * as Directives from './directives';
import * as Services from './services';
import * as Pipes from './pipes';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatRippleModule,
    MatTabsModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    Components.AlertComponent,
    Components.AvatarComponent,
    Components.ContextualMenuComponent,
    Components.PageComponent,
    Components.PageTitleComponent,
    Components.TabsComponent,
    Components.ModalWrapperComponent,
    Components.TableWrapperComponent,
    Components.ActivitiesComponent,
    Directives.EqualHeightDirective,
    Directives.TrackEventDirective,
    Pipes.SafeUrlPipe,
    Pipes.SlugUrlPipe,
    Pipes.ParseErrorMessagePipe,
    Pipes.DateFormatPipe,
    Pipes.DateTimeFormatPipe,
    Pipes.TimeFormatPipe,
    Pipes.DateAgoPipe,
  ],
  providers: [DatePipe, Services.MediaQueryService, Services.ErrorService],
  exports: [
    MatMenuModule,
    TranslateModule,
    Components.AlertComponent,
    Components.AvatarComponent,
    Components.ContextualMenuComponent,
    Components.PageComponent,
    Components.PageTitleComponent,
    Components.TabsComponent,
    Components.ModalWrapperComponent,
    Components.TableWrapperComponent,
    Components.ActivitiesComponent,
    Directives.EqualHeightDirective,
    Directives.TrackEventDirective,
    Pipes.SafeUrlPipe,
    Pipes.SlugUrlPipe,
    Pipes.ParseErrorMessagePipe,
    Pipes.DateFormatPipe,
    Pipes.DateTimeFormatPipe,
    Pipes.TimeFormatPipe,
    Pipes.DateAgoPipe,
  ],
})
export class GeneralModule {}
