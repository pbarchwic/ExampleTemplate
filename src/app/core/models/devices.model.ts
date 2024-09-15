import { Entity } from '.';
import { ExtendedType } from './extended.model';

export type Device<T> = {
  name: string;
  firmware: string;
  serialNumber: string;
  mac: string;
} & ExtendedType<T>;

export enum DeviceType {
  Bridge = 1,
  Lock = 2,
}

export interface DevicesResponse<T> {
  items: Device<T>[];
  itemsPerPage: number;
  page: number;
  permissions: DevicesPermissions;
}

export interface DevicesPermissions {
  canCurrentUserUnassignDevices: boolean;
}
export interface UnassignedDevice extends Entity {
  name: string;
  type: DeviceType;
}

export interface DevicesAssignable {
  devices: UnassignedDevice[];
}
