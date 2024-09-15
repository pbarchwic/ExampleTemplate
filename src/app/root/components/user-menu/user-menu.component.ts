import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { UserContext, User, AuthService } from '@app/core';
import { MediaQueryService, MediaQueryBreakpoint, TrackEventController } from '@app/shared';

@Component({
  selector: 'app-user-menu',
  templateUrl: 'user-menu.component.html',
  styleUrls: ['user-menu.component.scss'],
})
export class UserMenuComponent extends TrackEventController implements OnInit {
  @ViewChild('userMenuToggler') public userMenuToggler: MatMenuTrigger;
  public user: User;

  constructor(
    private readonly authService: AuthService,
    private readonly userContext: UserContext,
    private readonly mediaQueryService: MediaQueryService
  ) {
    super();
  }

  public get isMobile(): boolean {
    return this.mediaQueryService.is((breakpoint) => breakpoint <= MediaQueryBreakpoint.Small);
  }

  public get showClose(): boolean {
    if (!this.userMenuToggler) {
      return false;
    }

    return this.userMenuToggler.menuOpen && this.isMobile;
  }

  public ngOnInit(): void {
    this.user = this.userContext.user$.getValue();
  }

  public logout(): void {
    this.authService.signOut();
  }
}
