import { FormGroup, ValidationErrors } from '@angular/forms';

export function timeDetailsValidator(group: FormGroup): ValidationErrors | null {
  const startDateControl = group.get('startDate');
  const endDateControl = group.get('endDate');
  const startTimeControl = group.get('startTime');
  const endTimeControl = group.get('endTime');
  const startDate: number = startDateControl.value && startDateControl.value.getTime();
  if (!startDate) {
    return null;
  }

  const endDate: number = endDateControl.value && endDateControl.value.getTime();
  if (!endDate) {
    return null;
  }

  if (startDate > endDate) {
    return {
      startDateGreaterThanEnd: true,
    };
  }

  if (startDate < endDate) {
    return;
  }

  const startTime: string = startTimeControl.value;
  if (!startTime) {
    return null;
  }

  const endTime: string = endTimeControl.value;
  if (!endTime) {
    return null;
  }

  if (startTime >= endTime) {
    return {
      startDateGreaterThanEnd: true,
    };
  }

  return null;
}
