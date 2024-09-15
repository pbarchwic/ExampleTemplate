import { DeviceType } from './devices.model';
import { AccessType, AccessLevel } from './permission.model';

export interface OrganizationUserDevicePermission {
  userId: number;
  displayName: string;
  email: string;
  deviceId: number;
  deviceName: string;
  deviceType: DeviceType;
  deviceShareId: number;
  remoteAccessDisabled: boolean;
  accessType: AccessType;
  accessLevel: AccessLevel;
  repeatEvent: {
    weekDays: number;
    dayStartTime: Date;
    dayEndTime: Date;
    startDate: Date;
    endDate: Date;
  };
}

export interface OrganizationUserDevicesResponse {
  userDisplayName: string;
  userId: number;
  page: number;
  itemsPerPage: number;
  devices: OrganizationUserDevicePermission[];
}
