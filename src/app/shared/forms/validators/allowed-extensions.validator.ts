import { ValidationErrors } from '@angular/forms';

import { FormUploadControl } from '../controls';
import { FormUploadItem } from '../models';

export function allowedExtensionValidator(control: FormUploadControl): ValidationErrors | null {
  const items: FormUploadItem[] = control.value;
  if (!items || !items.length) {
    return null;
  }

  const validateExtension = (type: string): boolean => control.allowedMimeTypes.includes(type);
  const invalidExtension = Array.from(items).some((item: FormUploadItem) => !validateExtension(item.file.type));
  if (!invalidExtension) {
    return null;
  }

  return {
    allowedExtensions: true
  };
}
