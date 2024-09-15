import { DeviceEventType } from './device-event.model';
import { DeviceType } from './devices.model';

export interface UserActivityEvent {
  deviceId: number;
  deviceName: string;
  event: DeviceEventType;
  deviceType: DeviceType;
  date: string;
}

export interface DeviceActivityEvent {
  userId: number;
  userName: string;
  event: DeviceEventType;
  date: string;
}

export interface CommonActivityEvent {
  title?: string;
  event: DeviceEventType;
  date: string;
  by?: string;
  deviceId?: number;
  userId?: number;
  deviceType?: DeviceType;
}

export interface Activity<T> {
  date: string;
  events: T[];
}

export interface Activities<T> {
  page: number;
  itemsPerPage: number;
  activities: Activity<T>[];
}

export interface DeviceActivityResponse {
  id: number;
  deviceId: number;
  userId: number;
  organizationUserId: number;
  username: string;
  event: number;
  source: number;
  date: string;
}

export interface UserActivityResponse {
  userId: number;
  userDisplayName: string;
  page: number;
  itemsPerPage: number;
  events: UserActivityEvent[];
}
