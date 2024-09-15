import { Component } from '@angular/core';

import { TabItem } from '@app/shared/general/components';
import { RefreshPermissionData, SidebarService, TrackEventController } from '@app/shared';
import { MatrixService } from '../../services';
import { AddPermissionComponentData, AddPermissionComponent } from '@app/shared';

@Component({
  selector: 'app-permission-layout',
  templateUrl: 'permission-layout.component.html',
  styleUrls: ['./permission-layout.component.scss'],
})
export class PermissionsLayoutComponent extends TrackEventController {
  public tabs: TabItem[] = [
    { label: 'locks', path: 'locks' },
    { label: 'bridges', path: 'bridges' },
  ];
  constructor(private readonly sidebarService: SidebarService, private readonly matrixService: MatrixService) {
    super();
  }

  public addPermission(): void {
    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, {
      user: null,
      device: null,
      permission: null,
      onUpdated: (data: RefreshPermissionData) => this.updatePermission(data),
      onDeleted: (data: RefreshPermissionData) => this.updatePermission(data),
    });
  }

  private updatePermission(data: RefreshPermissionData): void {
    if (!data.userId) {
      this.matrixService.forceRefreshPermissions$.next();
      return;
    }

    this.matrixService.refreshPermissionInMatrix$.next(data);
  }
}
