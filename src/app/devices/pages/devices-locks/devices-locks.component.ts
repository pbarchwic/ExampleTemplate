import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AddPermissionComponent, AddPermissionComponentData, SidebarService } from '@app/shared';
import { DevicesRepository, Lock, OrganizationContext, Device, DevicesResponse, DevicesPermissions } from '@app/core';
import { DevicesService } from '../../services';
import { DeleteDeviceComponent, DeleteDeviceComponentData, UnassignDeviceComponent, UnassignDeviceComponentData } from '../../modals';
import { lockStateIcons } from './devices-status.config';

@Component({
  selector: 'app-devices-locks',
  templateUrl: 'devices-locks.component.html',
})
export class DevicesLocksComponent implements OnInit {
  public organizationId: number;
  public locks: Device<Lock>[] = [];
  public currentPage = 0;
  public lockStateIcons = lockStateIcons;
  public itemsPerPage = 25;
  public isLastPage: boolean;
  public isLoading = false;
  public isError = false;
  public permissions: DevicesPermissions;
  public contextMenuBasic = [
    {
      label: 'assign_permission',
      action: 'assignPermissions',
      theme: 'default',
      order: 1,
    },
    {
      label: 'delete',
      action: 'delete',
      theme: 'danger',
      order: 3,
    },
  ];
  public contextMenu = [
    ...this.contextMenuBasic,
    {
      label: 'unassign_device',
      action: 'unassign',
      theme: 'default',
      order: 2,
    },
  ];

  private subscriptions = new Subscription();

  constructor(
    private readonly dialog: MatDialog,
    private readonly deviceRepository: DevicesRepository,
    private readonly organizationContext: OrganizationContext,
    private readonly devicesService: DevicesService,
    private readonly sidebarService: SidebarService
  ) {}

  public ngOnInit(): void {
    this.organizationId = this.organizationContext.organization$.value.id;
    this.getLocks();
    this.subscriptions.add(this.getRefreshListSubscription());
  }

  public trackByDeviceId(index: number, lock: any): string {
    return lock.deviceId;
  }

  public refreshLocks(): void {
    this.locks = [];
    this.currentPage = 0;
    this.isLastPage = false;
    this.getLocks();
  }

  public getLocks(): void {
    if (this.isLoading || this.isLastPage) {
      return;
    }

    this.currentPage += 1;
    this.isLoading = true;
    this.isError = false;
    this.deviceRepository
      .getLocksDevices({
        organizationId: this.organizationId,
        page: this.currentPage,
        itemsPerPage: this.itemsPerPage,
      })
      .subscribe(
        (devices: DevicesResponse<Lock>) => {
          this.isLastPage = this.currentPage > 1 && devices.items.length < this.itemsPerPage;
          this.locks = [...this.locks, ...devices.items];
          this.permissions = devices.permissions;
          this.isLoading = false;
        },
        () => {
          this.isError = true;
          this.isLoading = false;
        }
      );
  }

  public contextMenuAction(action: string, lock: Device<Lock>): void {
    switch (action) {
      case 'assignPermissions':
        this.assignPermissions(lock);
        break;
      case 'delete':
        this.deleteDevice(lock);
        break;
      case 'unassign':
        this.unassignDevice(lock);
        break;
    }
  }

  private deleteDevice(lock: Device<Lock>): void {
    this.dialog.open(DeleteDeviceComponent, {
      data: {
        device: lock,
        deviceId: lock.deviceId,
        onDeleted: () => this.onDeletedLock(lock),
      } as DeleteDeviceComponentData,
    });
  }

  private unassignDevice(lock: Device<Lock>): void {
    this.dialog.open(UnassignDeviceComponent, {
      data: {
        device: lock,
        deviceId: lock.deviceId,
        onUnassigned: () => this.onDeletedLock(lock),
      } as UnassignDeviceComponentData,
    });
  }

  private onDeletedLock(lock: Device<Lock>): void {
    this.locks = this.locks.filter((item) => item.deviceId !== lock.deviceId);
    if (this.locks.length < 3 && !this.isLastPage) {
      this.refreshLocks();
    }
  }

  private assignPermissions(lock: Device<Lock>): void {
    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, { device: { ...lock, id: lock.deviceId } });
  }

  private getRefreshListSubscription(): Subscription {
    return this.devicesService.refreshDevices$.subscribe(() => this.refreshLocks());
  }
}
