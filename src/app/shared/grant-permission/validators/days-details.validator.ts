import { FormGroup, ValidationErrors } from '@angular/forms';

export function daysDetailsValidator(group: FormGroup): ValidationErrors | null {
  const startTimeControl = group.get('dailyStartTime');
  const endTimeControl = group.get('dailyEndTime');

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
      startTimeGreaterThanEnd: true
    };
  }

  return null;
}
