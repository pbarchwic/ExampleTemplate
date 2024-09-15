import { AccessLevel, AccessType, PermissionRepeatEvent } from './permission.model';

export interface DeviceUser {
  accessLevel: AccessLevel;
  accessType: AccessType;
  deviceId: number;
  id: number;
  organizationUserId: number;
  isPending: boolean;
  remoteAccessDisabled: boolean;
  repeatEvent: PermissionRepeatEvent;
  userDisplayName: string;
  userEmail: string;
  userId: number;
  userIdentity: string;
}
