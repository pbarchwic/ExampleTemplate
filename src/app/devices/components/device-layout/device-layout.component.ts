import { Component, OnInit } from '@angular/core';
import { DeviceDetails } from '@app/core';

import { DeviceContext } from '../../contexts';

import { AddPermissionComponent, AddPermissionComponentData, SidebarService, TabItem, TrackEventController } from '@app/shared';
import { lockStateIcons } from '../../pages/devices-locks/devices-status.config';

@Component({
  selector: 'app-device-layout',
  templateUrl: 'device-layout.component.html',
  styleUrls: ['./device-layout.component.scss'],
})
export class DeviceLayoutComponent extends TrackEventController implements OnInit {
  public lockStateIcons = lockStateIcons;
  public device: DeviceDetails;
  public tabs: TabItem[] = [
    { label: 'details', path: 'details' },
    { label: 'users', path: 'users' },
    { label: 'activities', path: 'activities' },
  ];

  constructor(public readonly deviceContext: DeviceContext, private readonly sidebarService: SidebarService) {
    super();
  }

  public get updateAvailable(): boolean {
    if (!this.device.softwareVersions || !this.device.softwareVersions.length) {
      return false;
    }

    return this.device.softwareVersions.some((version) => version.updateAvailable);
  }

  public ngOnInit(): void {
    this.device = this.deviceContext.device$.value;
  }

  public addPermission(): void {
    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, {
      device: {
        id: this.device.id,
        name: this.device.name,
        type: this.device.type,
      },
      onUpdated: () => this.deviceContext.refreshUsers$.next(),
      onDeleted: () => this.deviceContext.refreshUsers$.next(),
    });
  }
}
