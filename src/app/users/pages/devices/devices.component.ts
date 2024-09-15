import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { OrganizationUserDevicePermission, OrganizationUserProfile, UsersRepository } from '@app/core';
import { AddPermissionComponent, AddPermissionComponentData, DeletePermissionComponent, SidebarService } from '@app/shared';
import { OrganizationUserContext } from '../../contexts';

@Component({
  selector: 'app-user-devices',
  templateUrl: 'devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class UserDevicesComponent implements OnInit, OnDestroy {
  public user: OrganizationUserProfile;
  public devices: OrganizationUserDevicePermission[] = [];
  public currentPage = 0;
  public itemsPerPage = 25;
  public isLastPage: boolean;
  public isLoading = false;
  public isError = false;
  public contextMenu = [
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

  private subscription = new Subscription();

  constructor(
    private readonly dialog: MatDialog,
    private readonly usersRepository: UsersRepository,
    private readonly organizationUserContext: OrganizationUserContext,
    private readonly sidebarService: SidebarService
  ){

  }

  public ngOnInit(): void {
    this.organizationUserContext.showGrantAccess$.next(true);
    this.user = this.organizationUserContext.user$.value;
    this.getDevices();
    this.subscription.add(
      this.organizationUserContext.refreshDevices$
        .subscribe(() => this.refreshDevices())
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.organizationUserContext.showGrantAccess$.next(false);
  }

  public trackByDeviceId(index: number, device: OrganizationUserDevicePermission): number {
    return device.deviceId;
  }

  public refreshDevices(): void {
    this.devices = [];
    this.currentPage = 0;
    this.isLastPage = false;
    this.getDevices();
  }

  public getDevices(): void {
    if (this.isLoading || this.isLastPage) {
      return;
    }

    this.currentPage += 1;
    this.isLoading = true;
    this.isError = false;
    this.usersRepository.getUserDevices({
      userId: this.user.id,
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage
    }).subscribe((response) => {
      this.isLastPage = this.currentPage > 1 && response.devices.length < this.itemsPerPage;
      this.devices = [...this.devices, ...response.devices];
      this.isLoading = false;
    }, () => {
      this.isError = true;
      this.isLoading = false;
    });
  }

  public contextMenuAction(action: string, device: OrganizationUserDevicePermission): void {
    switch (action) {
      case 'editAccess':
        this.editAccess(device);
        break;
      case 'deleteAccess':
        this.deleteAccess(device);
        break;
    }
  }

  private editAccess(device: OrganizationUserDevicePermission): void {
    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, {
      device: {
        id: device.deviceId,
        name: device.deviceName,
        type: device.deviceType
      },
      permission: {
        deviceId: device.deviceId,
        accessLevel: device.accessLevel,
        accessType: device.accessType
      },
      user: {
        id: this.user.id,
        displayName: this.user.displayName,
        email: this.user.email,
        devicesPermission: undefined,
        isOwner: this.user.isOwner
      },
      onUpdated: () => this.onModifiedAccess(),
      onDeleted: () => this.onDeletedAccess(device)
    });
  }

  private deleteAccess(device: OrganizationUserDevicePermission): void {
    this.dialog.open(DeletePermissionComponent, {
      data: {
        deviceShareId: device.deviceShareId,
        onDeleted: () => this.onDeletedAccess(device)
      },
    });
  }

  private onDeletedAccess(device: OrganizationUserDevicePermission): void {
    this.devices = this.devices.filter(item => item.deviceId !== device.deviceId);
  }

  private onModifiedAccess(): void {
    this.refreshDevices();
  }
}
