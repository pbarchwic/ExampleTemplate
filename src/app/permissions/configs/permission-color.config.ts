import { AccessType } from '@app/core';
import { accessColor } from '../constants';

export const permissionColors = {
  [AccessType.Permanent]: accessColor.permanent,
  [AccessType.TimeRestricted]: accessColor.timeRestricted,
  [AccessType.Recurring]: accessColor.recurring,
};
