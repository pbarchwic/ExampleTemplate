import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Lock,
  Response,
  Bridge,
  DevicesResponse,
  AllDevicesResponse,
  DevicesAssignable,
  DeviceDetails,
  DeviceActivityResponse,
  DeviceUser,
  UpdateLockName,
  UpdateBridgeName,
} from '../models';
import { AddDevicesCommand, GetDevicesCommand } from '../commands';

@Injectable()
export class DevicesRepository {
  private readonly url: string = '/organizationdevice';

  constructor(private readonly http: HttpClient) {}

  public getLocksDevices(command: GetDevicesCommand): Observable<DevicesResponse<Lock>> {
    return this.http
      .get<Response<DevicesResponse<Lock>>>(
        `${this.url}/${command.organizationId}/locks?page=${command.page}&itemsPerPage=${command.itemsPerPage}`
      )
      .pipe(map((response: Response<DevicesResponse<Lock>>) => response.result));
  }

  public getBridgesDevices(command: GetDevicesCommand): Observable<DevicesResponse<Bridge>> {
    return this.http
      .get<Response<DevicesResponse<Bridge>>>(
        `${this.url}/${command.organizationId}/bridges?page=${command.page}&itemsPerPage=${command.itemsPerPage}`
      )
      .pipe(map((response: Response<DevicesResponse<Bridge>>) => response.result));
  }

  public getAllDevices(command: GetDevicesCommand): Observable<AllDevicesResponse> {
    const params: { [key: string]: any } = {};
    if (command.itemsPerPage) {
      params.itemsPerPage = command.itemsPerPage;
    }
    if (command.page) {
      params.page = command.page;
    }

    return this.http
      .get<Response<AllDevicesResponse>>(`${this.url}/${command.organizationId}`, { params })
      .pipe(map((response: Response<AllDevicesResponse>) => response.result));
  }

  public getLockDetails(id: number): Observable<DeviceDetails> {
    return this.http.get<Response<DeviceDetails>>(`/my/lock/${id}`).pipe(map((response) => response.result));
  }

  public getBridgeDetails(id: number): Observable<DeviceDetails> {
    return this.http.get<Response<DeviceDetails>>(`/my/bridge/${id}`).pipe(map((response) => response.result));
  }

  public getDeviceActivities(deviceId: number, elements: number, lastElemDate: string): Observable<DeviceActivityResponse[]> {
    const url = `/my/deviceactivity?deviceId=${deviceId}&elements=${elements}&lastElemDate=${lastElemDate}`;
    return this.http.get<Response<DeviceActivityResponse[]>>(url).pipe(map((response) => response.result));
  }

  public getDeviceUsers(deviceId: number): Observable<DeviceUser[]> {
    return this.http.get<Response<any>>(`/my/deviceshare?deviceId=${deviceId}`).pipe(map((response) => response.result));
  }

  public getUserDevice(): Observable<DevicesAssignable> {
    return this.http
      .get<Response<DevicesAssignable>>(`${this.url}/assignable`)
      .pipe(map((response: Response<DevicesAssignable>) => response.result));
  }

  public deleteDevice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  public unassignDevice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}/unassign`);
  }

  public addDevices(data: AddDevicesCommand): Observable<void> {
    return this.http.put<void>(this.url, data);
  }

  public updateLock(data: UpdateLockName): Observable<void> {
    return this.http.patch<void>(`/my/lock`, data);
  }

  public updateBridge(data: UpdateBridgeName): Observable<void> {
    return this.http.put<void>(`/my/bridge`, data);
  }
}
