export interface Lock {
  deviceId: number;
  battery: number;
  statuses: LockStatuses;
  autoLock: boolean;
  pullSpring: boolean;
}

export interface LockStatuses {
  isConnected: boolean;
  lockState: LockState;
  softwareUpdateAvailable: boolean;
}

export interface UpdateLockName {
  id: number;
  name: string;
  revision: number;
}

export enum LockState {
  Uncalibrated = 0,
  Calibration = 1,
  Open = 2,
  PartiallyOpen = 3,
  Opening = 4,
  Closing = 5,
  Closed = 6,
  SpringPull = 7,
  OpeningWithPull = 8,
  Unknown = 9,
  PullSpringCalibration = 17,
}
