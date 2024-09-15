import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

export type FormInputType = 'input' | 'textarea';

@Component({
  selector: 'app-form-input',
  templateUrl: 'form-input.component.html',
  styleUrls: ['form-input.component.scss']
})
export class FormInputComponent {
  @Input() type: FormInputType = 'input';
  @Input() label: string;
  @Input() placeholder: string;
  @Input() hint: string;
  @Input() control: FormControl;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() prefix: string;

  public onBlur(event: FocusEvent): void {
    const value = (event.target as HTMLInputElement).value;
    this.control.setValue(value.trim());
  }
}
