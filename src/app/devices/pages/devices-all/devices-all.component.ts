import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AddPermissionComponent, AddPermissionComponentData, SidebarService } from '@app/shared';
import { DevicesRepository, Device, OrganizationContext, AllDevice, AllDevicesResponse, DevicesPermissions } from '@app/core';
import { DevicesService } from '../../services';
import { DeleteDeviceComponent, DeleteDeviceComponentData, UnassignDeviceComponent, UnassignDeviceComponentData } from '../../modals';
import { lockStateIcons } from '../devices-locks/devices-status.config';

@Component({
  selector: 'app-devices-all',
  templateUrl: 'devices-all.component.html',
})
export class DevicesAllComponent implements OnInit, OnDestroy {
  public organizationId: number;
  public devices: Device<AllDevice>[] = [];
  public currentPage = 0;
  public itemsPerPage = 25;
  public isLastPage: boolean;
  public isLoading = false;
  public isError = false;
  public lockStateIcons = lockStateIcons;
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
    this.getDevices();
    this.subscriptions.add(this.getRefreshListSubscription());
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public trackByDeviceId(index: number, brigde: any): string {
    return brigde.deviceId;
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
    this.deviceRepository
      .getAllDevices({
        organizationId: this.organizationId,
        page: this.currentPage,
        itemsPerPage: this.itemsPerPage,
      })
      .subscribe(
        (devices: AllDevicesResponse) => {
          this.isLastPage = this.currentPage > 1 && devices.organizationDevices.length < this.itemsPerPage;
          this.devices = [...this.devices, ...devices.organizationDevices];
          this.permissions = devices.permissions;
          this.isLoading = false;
        },
        () => {
          this.isError = true;
          this.isLoading = false;
        }
      );
  }

  public contextMenuAction(action: string, device: Device<AllDevice>): void {
    switch (action) {
      case 'assignPermissions':
        this.assignPermissions(device);
        break;
      case 'delete':
        this.deleteDevice(device);
        break;
      case 'unassign':
        this.unassignDevice(device);
        break;
    }
  }

  private deleteDevice(device: Device<AllDevice>): void {
    this.dialog.open(DeleteDeviceComponent, {
      data: {
        device,
        deviceId: device.id,
        onDeleted: () => this.onDeletedDevice(device),
      } as DeleteDeviceComponentData,
    });
  }

  private unassignDevice(device: Device<AllDevice>): void {
    this.dialog.open(UnassignDeviceComponent, {
      data: {
        device,
        deviceId: device.id,
        onUnassigned: () => this.onDeletedDevice(device),
      } as UnassignDeviceComponentData,
    });
  }

  private onDeletedDevice(device: Device<AllDevice>): void {
    this.devices = this.devices.filter((item) => item.id !== device.id);
    if (this.devices.length < 3 && !this.isLastPage) {
      this.refreshDevices();
    }
  }

  private assignPermissions(device: Device<AllDevice>): void {
    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, { device });
  }

  private getRefreshListSubscription(): Subscription {
    return this.devicesService.refreshDevices$.subscribe(() => this.refreshDevices());
  }
}
