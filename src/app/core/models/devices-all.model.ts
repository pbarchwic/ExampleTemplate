import { LockState } from './devices-lock.model';
import { Device, DevicesPermissions, DeviceType } from './devices.model';

export interface AllDevice {
  id: number;
  statuses: AllDeviceStatuses;
  type: DeviceType;
}

export interface AllDeviceStatuses {
  deviceSoftwareUpdateAvailable: boolean;
  isConnected: boolean;
  lockState: LockState;
  wiFiSoftwareUpdateAvailable: boolean;
}

export interface AllDevicesResponse {
  organizationDevices: Device<AllDevice>[];
  itemsPerPage: number;
  page: number;
  permissions: DevicesPermissions;
}
