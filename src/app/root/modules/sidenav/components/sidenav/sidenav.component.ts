import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SidenavContext } from '@app/core';
import { sidenavAnimation } from '../../animations';
import { SidenavService } from '../../services';
import { SidenavNavigateEvent, SidenavType } from '../../models';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [sidenavAnimation],
})
export class SidenavComponent {
  @Input() collapsed: boolean;
  @Input() isMobile: boolean;

  @Output() collapse = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly router: Router,
    public readonly sidenavService: SidenavService,
    private readonly sidenavContext: SidenavContext
  ) {}

  public get sidenavType(): SidenavType {
    if (this.isMobile) {
      return 'mobile';
    }

    return this.collapsed ? 'collapsed' : 'expanded';
  }

  public navigate(event: SidenavNavigateEvent): void {
    if (event.mouseEvent.ctrlKey) {
      window.open(window.location.origin + event.route, '_blank');
      window.focus();
      return;
    }

    this.router.navigate([event.route]);
  }

  public animationDone(): void {
    this.sidenavContext.sidenavToggle$.next(this.collapsed);
  }
}
