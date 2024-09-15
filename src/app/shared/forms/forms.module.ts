import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule as NgFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { GeneralModule } from '../general';

import * as Components from './components';
import * as Directives from './directives';

@NgModule({
  imports: [
    CommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    GeneralModule,
    TranslateModule,
  ],
  declarations: [
    Components.FormInputComponent,
    Components.FormUploadComponent,
    Components.FormAutocompleteComponent,
    Components.FormSelectComponent,
    Components.FormDatepickerComponent,
    Components.FormTimepickerComponent,
    Components.FormDaypickerComponent,
    Components.FormCheckboxListComponent,
    Components.FormCheckboxComponent,
    Directives.FileDropDirective,
  ],
  exports: [
    NgFormsModule,
    ReactiveFormsModule,
    Components.FormInputComponent,
    Components.FormUploadComponent,
    Components.FormAutocompleteComponent,
    Components.FormSelectComponent,
    Components.FormDatepickerComponent,
    Components.FormDaypickerComponent,
    Components.FormTimepickerComponent,
    Components.FormCheckboxListComponent,
    Components.FormCheckboxComponent
  ],
})
export class FormsModule {}
