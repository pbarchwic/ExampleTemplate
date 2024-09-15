import { Injectable, Type, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SidebarContent } from '../models';

@Injectable()
export class SidebarService {
  public readonly content = new BehaviorSubject<SidebarContent>(undefined);
  public readonly openedChange = new EventEmitter<boolean>(undefined);
  public readonly animationDone = new EventEmitter<boolean>(undefined);

  public open<T>(component: Type<any>, data?: T): void {
    this.content.next(new SidebarContent(component, data));
    this.openedChange.emit(true);
  }

  public close(): void {
    this.content.next(undefined);
    this.openedChange.emit(false);
  }

  public getData<T>(): T {
    return this.content.value.data;
  }
}
