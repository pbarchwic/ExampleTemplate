import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-timepicker',
  templateUrl: 'form-timepicker.component.html',
  styleUrls: ['form-timepicker.component.scss'],
})
export class FormTimepickerComponent {
  @Input() label: string;
  @Input() control: FormControl;
  @Input() min: string;
  @Input() max: string;
}
