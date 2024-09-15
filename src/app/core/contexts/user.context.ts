import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User } from '../models';

@Injectable()
export class UserContext {
  public readonly user$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
}
