import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SidenavItem, SidenavNavigateEvent } from '../../models';
import { MenuBaseComponent } from '../menu-base/menu-base.component';

@Component({
  selector: 'app-menu-full',
  templateUrl: './menu-full.component.html',
  styleUrls: ['./menu-full.component.scss'],
})
export class MenuFullComponent extends MenuBaseComponent {
  @Input() item: SidenavItem;
  @Output() menuNavigate = new EventEmitter<SidenavNavigateEvent>();

  constructor(protected readonly router: Router) {
    super();
  }

  public navigate(event: MouseEvent, route: string): void {
    event.stopPropagation();
    this.menuNavigate.emit({
      mouseEvent: event,
      route
    });
  }
}
