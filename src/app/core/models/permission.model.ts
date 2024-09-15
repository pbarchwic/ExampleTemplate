import { DeviceType } from './devices.model';
import { OrganizationUser } from './users.model';
import { Entity } from './entity.model';

export interface PermissionResponse {
  devices: PermissionDevice[];
  users: PermissionUser[];
  itemsPerPage: number;
  page: number;
  usersCount: number;
}

export interface PermissionDevice extends Entity {
  name: string;
  type?: DeviceType;
}

export interface PermissionUser extends OrganizationUser {
  isOwner: boolean;
  devicesPermission: UserDevicePermission[];
  mappedPermissions?: Dictionary<MappedMatrixPermissions>;
}

export interface MappedMatrixPermissions {
  accessLevel: AccessLevel;
  accessType: AccessType;
  icon: string;
  color: string;
}
export interface UserDevicePermission {
  deviceId: number;
  accessLevel: AccessLevel;
  accessType: AccessType;
}

export interface PermissionRepeatEvent {
  weekDays: number;
  dayStartTime: Date;
  dayEndTime: Date;
  startDate: Date;
  endDate: Date;
}

export interface PermissionDetails {
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
  repeatEvent: PermissionRepeatEvent;
}

export interface Dictionary<T> {
  [Key: string]: T;
}

export enum AccessLevel {
  Guest = 0,
  Admin = 1,
  Owner = 2,
  None = 3,
}

export enum AccessType {
  Permanent = 0,
  TimeRestricted = 1,
  Recurring = 2,
  None = 3,
}

export interface PermissionOptions {
  deviceType: DeviceType;
  page: number;
  itemsPerPage: number;
}
