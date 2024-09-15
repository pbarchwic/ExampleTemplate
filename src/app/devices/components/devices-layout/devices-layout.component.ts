import { Component } from '@angular/core';
import { TabItem } from '@app/shared/general/components';
import { SidebarService, TrackEventController } from '@app/shared';

import { AddDeviceComponent, AddDeviceComponentData } from '../../sidebars';
import { DevicesService } from '../../services';

@Component({
  selector: 'app-devices-layout',
  templateUrl: 'devices-layout.component.html',
})
export class DevicesLayoutComponent extends TrackEventController {
  public tabs: TabItem[] = [
    { label: 'all', path: 'all' },
    { label: 'locks', path: 'locks' },
    { label: 'bridges', path: 'bridges' },
  ];

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly devicesService: DevicesService
  ) {
    super();
  }

  public addDevice(): void {
    this.sidebarService.open(AddDeviceComponent, {
      onAdded: () => this.devicesService.refreshDevices$.next()
    } as AddDeviceComponentData);
  }
}
