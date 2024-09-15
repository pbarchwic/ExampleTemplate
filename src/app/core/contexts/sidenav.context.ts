import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SidenavContext {
  public readonly sidenavToggle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
}
