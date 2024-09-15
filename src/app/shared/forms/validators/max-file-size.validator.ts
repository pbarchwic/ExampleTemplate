import { ValidationErrors } from '@angular/forms';
import { FormUploadControl } from '../controls';
import { FormUploadItem } from '../models';

export function maxFileSizeValidator(control: FormUploadControl): ValidationErrors | null {
  const items: FormUploadItem[] = control.value;
  if (!items || !items.length) {
    return null;
  }

  const maxFileSize = control.maxFileSize;
  const validateFileSize = (size: number): boolean => size <= maxFileSize;
  const invalidFileSize = Array.from(items).some((item: FormUploadItem) => !validateFileSize(item.file.size));
  if (!invalidFileSize) {
    return null;
  }

  return {
    maxFileSize: true
  };
}
