import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Organization } from '../models';

@Injectable()
export class OrganizationContext {
  public readonly organization$: BehaviorSubject<Organization> = new BehaviorSubject<Organization>(undefined);

  public get hasOrganization(): boolean {
    return typeof this.organization$.value !== 'undefined';
  }

  public clear(): void {
    this.organization$.next(undefined);
  }
}
