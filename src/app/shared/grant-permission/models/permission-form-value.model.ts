import { AccessLevel, AccessType, PermissionDevice, PermissionUser, WeekDays } from '@app/core';
import { FormAutocompleteItem } from '@app/shared';

export interface PermissionFormValue {
  user?: PermissionUser | FormAutocompleteItem;
  device?: PermissionDevice | FormAutocompleteItem;
  accessDetails: PermissionFormAccessDetails;
}

export interface PermissionFormAccessDetails {
  accessLevel: AccessLevel;
  accessType: AccessType;
  remoteAccessDisabled?: boolean;
  timeDetails?: {
    startDate: Date;
    startTime: string;
    endDate: Date;
    endTime: string;
  };
  daysDetails?: {
    days: WeekDays[];
    dailyStartTime: string;
    dailyEndTime: string;
  };
}
export interface RefreshPermissionData {
  userId: number;
  deviceId: number;
  accessLevel: AccessLevel;
  accessType: AccessType;
}
