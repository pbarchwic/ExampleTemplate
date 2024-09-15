import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class DevicesService {
  public readonly refreshDevices$ = new Subject<void>();
}
