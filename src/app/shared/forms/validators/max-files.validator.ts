import { ValidationErrors } from '@angular/forms';
import { FormUploadControl } from '../controls';
import { FormUploadItem } from '../models';

export function maxFilesValidator(control: FormUploadControl): ValidationErrors | null {
  const items: FormUploadItem[] = control.value;
  if (!items || !items.length) {
    return null;
  }

  if (items.length <= control.maxFiles) {
    return null;
  }

  return {
    maxFiles: true
  };
}
