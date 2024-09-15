import { FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormCheckboxListValue } from '@app/shared';

export function minDevicesValidator(minLength: number): ValidatorFn {
  return (groupArray: FormArray): ValidationErrors | null => {
    const values = groupArray.value as FormCheckboxListValue[];
    const checkedControls = values.filter(value => value.checked);
    if (checkedControls.length >= minLength) {
      return null;
    }

    return {
      minSelectedDevices: true
    };
  };
}


