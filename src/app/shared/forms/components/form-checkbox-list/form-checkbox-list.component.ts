import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

export interface FormCheckboxListValue {
  title: string;
  subtitle?: string;
  value: any;
  checked: boolean;
  originalValue: any;
  hidden: boolean;
}

@Component({
  selector: 'app-form-checkbox-list',
  templateUrl: 'form-checkbox-list.component.html',
  styleUrls: ['form-checkbox-list.component.scss']
})
export class FormCheckboxListComponent {
  @Input() controlArray: FormArray;
}
