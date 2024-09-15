import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormCheckboxListValue } from '../form-checkbox-list/form-checkbox-list.component';

@Component({
  selector: 'app-form-checkbox',
  templateUrl: 'form-checkbox.component.html',
  styleUrls: ['form-checkbox.component.scss']
})
export class FormCheckboxComponent {
  @Input() public readonly control: FormControl;

  public onChange(change: MatCheckboxChange, control: FormControl): void {
    const value = control.value as FormCheckboxListValue;
    control.setValue({
      ...value,
      checked: change.checked
    });
  }
}
