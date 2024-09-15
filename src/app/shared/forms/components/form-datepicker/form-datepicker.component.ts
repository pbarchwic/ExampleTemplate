import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-form-datepicker',
  templateUrl: 'form-datepicker.component.html',
  styleUrls: ['form-datepicker.component.scss'],
})
export class FormDatepickerComponent {
  @Input() label: string;
  @Input() control: FormControl;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Output() dateChange = new EventEmitter<string>();
}
