import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { DeviceDetails } from '@app/core';

@Injectable()
export class DeviceContext {
  public readonly device$ = new BehaviorSubject<DeviceDetails>(undefined);
  public readonly showGrantAccess$ = new BehaviorSubject<boolean>(false);
  public readonly refreshUsers$ = new Subject<void>();
}
