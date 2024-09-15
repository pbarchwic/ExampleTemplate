import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { SidenavItem, SidenavNavigateEvent } from '../../models';
import { MenuBaseComponent } from '../menu-base/menu-base.component';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.scss'],
})
export class MenuMobileComponent extends MenuBaseComponent {
  @Input() item: SidenavItem;
  @Output() menuNavigate = new EventEmitter<SidenavNavigateEvent>();
  constructor(protected readonly router: Router, private readonly changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  public navigate(event: MouseEvent, route: string): void {
    this.menuNavigate.emit({
      mouseEvent: event,
      route
    });
  }

  public expandMobilePanel(): void {
    this.changeDetectorRef.detectChanges();
  }
}
