import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceShareRepository {
  private readonly url = '/my/deviceshare';

  constructor(private readonly http: HttpClient) { }

  public deleteDeviceShare(deviceShareId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${deviceShareId}`);
  }
}
