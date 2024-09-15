import { AccessLevel, AccessType } from '../models';

export interface CreatePermissionCommand {
  deviceId: number;
  userEmail: string;
  accessLevel: AccessLevel;
  accessType: AccessType;
  remoteAccessDisabled: boolean;
  repeatEvent: {
    weekDays: number;
    dayStartTime: Date;
    dayEndTime: Date;
    startDate: Date;
    endDate: Date;
  };
}

export interface UpdatePermissionCommand {
  id: number;
  accessLevel: AccessLevel;
  accessType: AccessType;
  remoteAccessDisabled: boolean;
  repeatEvent: {
    weekDays: number;
    dayStartTime: Date;
    dayEndTime: Date;
    startDate: Date;
    endDate: Date;
  };
}
