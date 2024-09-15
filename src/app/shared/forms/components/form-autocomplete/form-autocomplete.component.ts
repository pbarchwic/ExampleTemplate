import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormAutocompleteItem } from '../../models';

@Component({
  selector: 'app-form-autocomplete',
  templateUrl: 'form-autocomplete.component.html',
  styleUrls: ['form-autocomplete.component.scss'],
})
export class FormAutocompleteComponent implements OnChanges {
  @ViewChild('auto') matAutoComplete: MatAutocomplete;
  @Input() readOnly: string;
  @Input() selectedItem: FormAutocompleteItem;
  @Input() control: FormControl;
  @Input() label: string;
  @Input() icon: string;
  @Input() options: FormAutocompleteItem[] = [];
  @Input() searchBy: string[] = ['name'];
  @Output() selected = new EventEmitter<FormAutocompleteItem>();
  @Output() focusOut = new EventEmitter<string | FormAutocompleteItem>();
  public filteredOptions: Observable<FormAutocompleteItem[]>;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value && value.name ? value.name : value)),
        map((searchValue) => (searchValue ? this.filterOptions(searchValue) : this.options.slice()))
      );
    }
  }

  public optionSelected({ option }: MatAutocompleteSelectedEvent): void {
    this.selected.emit(option.value);
  }

  public displayFn(item: FormAutocompleteItem): string {
    return item && item.name ? item.name : '';
  }

  public getLabel(): string {
    const { value } = this.control;
    if (!value || typeof value === 'string') {
      return this.label;
    }

    return value.helperData || '';
  }

  public onBlur(): void {
    this.focusOut.emit(this.control.value);
  }

  private filterOptions(searchValue: string): FormAutocompleteItem[] {
    return this.options.filter((option) =>
      this.searchBy.some((searchByItem) =>
        option[searchByItem].toLowerCase().indexOf(searchValue.toLowerCase()) > -1));
  }
}
