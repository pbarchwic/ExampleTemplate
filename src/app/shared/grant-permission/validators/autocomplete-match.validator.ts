import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormAutocompleteItem } from '@app/shared';

export function autocompleteMatch(control: AbstractControl): ValidationErrors | null {
  const selection: string | FormAutocompleteItem = control.value;
  if (typeof selection === 'string') {
    return { valueNotFromTheList: true };
  }
  return null;
}
