import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AddPermissionComponent, AddPermissionComponentData, SidebarService } from '@app/shared';
import { DevicesRepository, Device, Bridge, DevicesResponse, OrganizationContext, DevicesPermissions } from '@app/core';
import { DeleteDeviceComponent, DeleteDeviceComponentData, UnassignDeviceComponent, UnassignDeviceComponentData } from '../../modals';
import { DevicesService } from '../../services';

@Component({
  selector: 'app-devices-bridges',
  templateUrl: 'devices-bridges.component.html',
})
export class DevicesBridgesComponent implements OnInit {
  public organizationId: number;
  public bridges: Device<Bridge>[] = [];
  public currentPage = 0;
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
    this.getBridges();
    this.subscriptions.add(this.getRefreshListSubscription());
  }

  public trackByDeviceId(index: number, brigde: any): string {
    return brigde.deviceId;
  }

  public refreshBridges(): void {
    this.bridges = [];
    this.currentPage = 0;
    this.isLastPage = false;
    this.getBridges();
  }

  public getBridges(): void {
    if (this.isLoading || this.isLastPage) {
      return;
    }

    this.currentPage += 1;
    this.isLoading = true;
    this.isError = false;
    this.deviceRepository
      .getBridgesDevices({
        organizationId: this.organizationId,
        page: this.currentPage,
        itemsPerPage: this.itemsPerPage,
      })
      .subscribe(
        (devices: DevicesResponse<Bridge>) => {
          this.isLastPage = this.currentPage > 1 && devices.items.length < this.itemsPerPage;
          this.bridges = [...this.bridges, ...devices.items];
          this.permissions = devices.permissions;
          this.isLoading = false;
        },
        () => {
          this.isError = true;
          this.isLoading = false;
        }
      );
  }

  public contextMenuAction(action: string, bridge: Device<Bridge>): void {
    switch (action) {
      case 'assignPermissions':
        this.assignPermissions(bridge);
        break;
      case 'delete':
        this.deleteDevice(bridge);
        break;
      case 'unassign':
        this.unassignDevice(bridge);
        break;
    }
  }

  private deleteDevice(bridge: Device<Bridge>): void {
    this.dialog.open(DeleteDeviceComponent, {
      data: {
        device: bridge,
        deviceId: bridge.id,
        onDeleted: () => this.onDeletedBridge(bridge),
      } as DeleteDeviceComponentData,
    });
  }

  private unassignDevice(bridge: Device<Bridge>): void {
    this.dialog.open(UnassignDeviceComponent, {
      data: {
        device: bridge,
        deviceId: bridge.id,
        onUnassigned: () => this.onDeletedBridge(bridge),
      } as UnassignDeviceComponentData,
    });
  }

  private onDeletedBridge(bridge: Device<Bridge>): void {
    this.bridges = this.bridges.filter((item) => item.id !== bridge.id);
    if (this.bridges.length < 3 && !this.isLastPage) {
      this.refreshBridges();
    }
  }

  private assignPermissions(bridge: Device<Bridge>): void {
    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, { device: bridge });
  }

  private getRefreshListSubscription(): Subscription {
    return this.devicesService.refreshDevices$.subscribe(() => this.refreshBridges());
  }
}
