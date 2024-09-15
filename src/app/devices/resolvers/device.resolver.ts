import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { DeviceDetails, DevicesRepository, DeviceType } from '@app/core';
import { Observable } from 'rxjs';
import { DeviceContext } from '../contexts';

@Injectable()
export class DeviceResolver implements Resolve<void> {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly deviceContext: DeviceContext
  ) {

  }

  public resolve(route: ActivatedRouteSnapshot): Promise<void> {
    const id = route.paramMap.get('id');
    const type = route.data.deviceType as DeviceType;

    return new Promise((resolve, reject) => {
      this.getDeviceDetails(type, +id).subscribe((device) => {
        this.deviceContext.device$.next(device);
        resolve();
      }, () => {
        // TODO: redirect to the error page
        reject();
      });
    });
  }

  private getDeviceDetails(type: DeviceType, id: number): Observable<DeviceDetails> {
    return type === DeviceType.Lock
      ? this.devicesRepository.getLockDetails(id)
      : this.devicesRepository.getBridgeDetails(id);
  }
}
