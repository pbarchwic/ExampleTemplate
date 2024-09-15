import { NgModule } from '@angular/core';

import { DashboardRoutes } from './dashboard.routes';
import * as Pages from './pages';

@NgModule({
  imports: [
    DashboardRoutes
  ],
  declarations: [
    Pages.DashboardComponent
  ],
})
export class DashboardModule { }
