import { Component } from '@angular/core';

import { SidebarService, TrackEventController } from '@app/shared';
import { UsersService } from '@app/users/services';
import { AddUserComponent, AddUserComponentData } from '@app/users/sidebars';

@Component({
  selector: 'app-users-layout',
  templateUrl: 'users-layout.component.html',
})
export class UsersLayoutComponent extends TrackEventController {

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  public addUser(): void {
    this.sidebarService.open<AddUserComponentData>(AddUserComponent, {
      onAdded: () => this.usersService.refreshUsers$.next(),
    });
  }
}
