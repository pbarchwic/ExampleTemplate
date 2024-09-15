import { LockState } from './devices-lock.model';
import { DeviceType } from './devices.model';

export interface DeviceDetailsGpsLocation {
  latitude: number;
  longitude: number;
}

export interface DeviceDetailsSettings {
  autoLockEnabled: boolean;
  autoLockDelay: number;
  autoLockImplicitEnabled: boolean;
  autoLockImplicitDelay: number;
  pullSpringEnabled: boolean;
  pullSpringDuration: number;
  autoPullSpringEnabled: boolean;
  postponedLockEnabled: boolean;
  postponedLockDelay: number;
  buttonLockEnabled: boolean;
  buttonUnlockEnabled: boolean;
}

export interface DeviceDetailsLockProperties {
  state: LockState;
  isCharging: boolean;
  batteryLevel: number;
}

export interface DeviceDetails {
  iotDeviceName?: string;
  voIPNumberId?: number;
  wasConfigured?: boolean;
  bridgeId: number;
  deviceSettings: DeviceDetailsSettings;
  autoUnlockEnabled: boolean;
  autoUnlockConfirmEnabled: boolean;
  autoUnlockRangeIn: number;
  autoUnlockRangeOut: number;
  autoUnlockTimeout: number;
  location: DeviceDetailsGpsLocation;
  lockProperties?: DeviceDetailsLockProperties;
  beaconMajor: number;
  beaconMinor: number;
  id: number;
  connectedToId: number;
  serialNumber: string;
  macAddress: string;
  name: string;
  userIdentity: string;
  type: DeviceType;
  created: string;
  revision: number;
  deviceRevision: number;
  targetDeviceRevision: number;
  isConnected: boolean;
  softwareVersions: {
    softwareType: number;
    updateAvailable: boolean;
    version: string;
  }[];
}
