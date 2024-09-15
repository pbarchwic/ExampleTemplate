import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { OrganizationUserProfile } from '@app/core';

@Injectable()
export class OrganizationUserContext {
  public readonly user$ = new BehaviorSubject<OrganizationUserProfile>(undefined);
  public readonly showGrantAccess$ = new BehaviorSubject<boolean>(false);
  public readonly refreshDevices$ = new Subject<void>();
}
