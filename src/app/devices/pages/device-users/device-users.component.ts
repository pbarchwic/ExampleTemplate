import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ArrayHelpers, DeviceDetails, DevicesRepository, DeviceUser, AccessLevel } from '@app/core';
import { AddPermissionComponent, AddPermissionComponentData, DeletePermissionComponent, SidebarService, SlugUrlPipe } from '@app/shared';
import { DeviceContext } from '../../contexts';

@Component({
  selector: 'app-device-users',
  templateUrl: 'device-users.component.html',
  providers: [SlugUrlPipe],
})
export class DeviceUsersComponent implements OnInit, OnDestroy {
  public device: DeviceDetails;
  public users: DeviceUser[];
  public isLoading = false;
  public isError = false;
  public accessLevel = AccessLevel;

  public contextOwnerMenu = [
    {
      label: 'user_details',
      action: 'goToUserDetails',
      theme: 'default',
    },
  ];

  public contextMenu = [
    ...this.contextOwnerMenu,
    {
      label: 'edit_access',
      action: 'editAccess',
      theme: 'default',
    },
    {
      label: 'delete_access',
      action: 'deleteAccess',
      theme: 'danger',
    },
  ];

  private readonly subscription = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly deviceContext: DeviceContext,
    private readonly devicesRepository: DevicesRepository,
    private readonly sidebarService: SidebarService,
    private readonly slugUrlPipe: SlugUrlPipe
  ) {}

  public ngOnInit(): void {
    this.device = this.deviceContext.device$.value;
    this.deviceContext.showGrantAccess$.next(true);
    this.getUsers();
    this.subscription.add(this.deviceContext.refreshUsers$.subscribe(() => this.getUsers()));
  }

  public ngOnDestroy(): void {
    this.deviceContext.showGrantAccess$.next(false);
    this.subscription.unsubscribe();
  }

  public trackById(user: DeviceUser): number {
    return user.id;
  }

  public getUsers(): void {
    this.users = [];
    this.isLoading = true;
    this.isError = false;
    this.devicesRepository.getDeviceUsers(this.device.id).subscribe(
      (users) => {
        this.isLoading = false;
        this.users = ArrayHelpers.sortByProperty(users, 'userDisplayName');
      },
      () => {
        this.isLoading = false;
        this.isError = true;
      }
    );
  }

  public contextMenuAction(action: string, user: DeviceUser): void {
    switch (action) {
      case 'goToUserDetails':
        this.router.navigateByUrl(this.slugUrlPipe.transform(`/users/${user.organizationUserId}`));
        break;
      case 'editAccess':
        this.editAccess(user);
        break;
      case 'deleteAccess':
        this.deleteAccess(user);
        break;
    }
  }

  private editAccess(user: DeviceUser): void {
    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, {
      device: {
        id: this.device.id,
        name: this.device.name,
        type: this.device.type,
      },
      permission: {
        deviceId: this.device.id,
        accessLevel: user.accessLevel,
        accessType: user.accessType,
      },
      user: {
        id: user.organizationUserId,
        displayName: user.userDisplayName,
        email: user.userEmail,
        devicesPermission: undefined,
        isOwner: false,
      },
      onUpdated: () => this.onModifiedAccess(),
      onDeleted: () => this.onDeletedAccess(user),
    });
  }

  private deleteAccess(user: DeviceUser): void {
    this.dialog.open(DeletePermissionComponent, {
      data: {
        deviceShareId: user.id,
        onDeleted: () => this.onDeletedAccess(user),
      },
    });
  }

  private onDeletedAccess(user: DeviceUser): void {
    this.users = this.users.filter((item) => item.id !== user.id);
  }

  private onModifiedAccess(): void {
    this.getUsers();
  }
}
