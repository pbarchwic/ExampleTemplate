import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class UsersService {
  public readonly refreshUsers$ = new Subject<void>();
}
