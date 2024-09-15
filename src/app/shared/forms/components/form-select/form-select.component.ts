import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormSelectItem } from '../../models';

@Component({
  selector: 'app-form-select',
  templateUrl: 'form-select.component.html',
  styleUrls: ['form-select.component.scss'],
})
export class FormSelectComponent {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() hint: string;
  @Input() control: FormControl;
  @Input() data: FormSelectItem[];

  public dataItem(id: number): FormSelectItem {
    return this.data.find((item) => item.value === id);
  }
}
