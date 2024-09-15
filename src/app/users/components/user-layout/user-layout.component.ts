import { Component, OnDestroy, OnInit } from '@angular/core';

import { AddPermissionComponent, AddPermissionComponentData, SidebarService, TabItem, TrackEventController } from '@app/shared';
import { OrganizationUser } from '@app/core';
import { OrganizationUserContext } from '../../contexts';

@Component({
  selector: 'app-user-layout',
  templateUrl: 'user-layout.component.html',
})
export class UserLayoutComponent extends TrackEventController implements OnInit, OnDestroy {
  public user: OrganizationUser;

  public tabs: TabItem[] = [
    // { label: 'profile', path: 'profile' },
    { label: 'devices', path: 'devices' },
    { label: 'activities', path: 'activities' },
  ];

  constructor(
    private readonly sidebarService: SidebarService,
    public readonly organizationUserContext: OrganizationUserContext
  ) {
    super();
  }

  public ngOnInit(): void {
    this.user =  this.organizationUserContext.user$.value;
  }

  public ngOnDestroy(): void {
    this.organizationUserContext.user$.next(undefined);
  }

  public addPermission(): void {
    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, {
      user: {
        id: this.user.id,
        displayName: this.user.displayName,
        email: this.user.email,
        devicesPermission: undefined,
        isOwner: this.user.isOwner
      },
      onUpdated: () => this.organizationUserContext.refreshDevices$.next(),
      onDeleted: () => this.organizationUserContext.refreshDevices$.next()
    });
  }
}
