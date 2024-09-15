import { NgModule } from '@angular/core';

import { AlertsRoutes } from './alerts.routes';
import * as Pages from './pages';

@NgModule({
  imports: [
    AlertsRoutes
  ],
  declarations: [
    Pages.AlertsComponent
  ]
})
export class AlertsModule { }
