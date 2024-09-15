import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AccessLevel, DeviceType, PermissionDevice, PermissionUser } from '@app/core';
import { TrackEventController } from '@app/shared';

@Component({
  selector: 'app-permission-share',
  templateUrl: './permission-share.component.html',
  styleUrls: ['./permission-share.component.scss'],
})
export class PermissionShareComponent extends TrackEventController {
  @Input() userIndex: number;
  @Input() deviceIndex: number;
  @Input() user: PermissionUser;
  @Input() device: PermissionDevice;
  @Input() deviceType: DeviceType;
  @Output() hoverUpdated = new EventEmitter<{ userIndex: number; deviceIndex: number }>();
  @Output() showSidebar = new EventEmitter<boolean>();
  public detailsOpen = false;
  public detailsTimer: number;
  constructor() {
    super();
  }

  public setHoverIndex(userIndex: number, deviceIndex: number): void {
    this.showDetails();
    this.hoverUpdated.emit({ userIndex, deviceIndex });
  }

  public resetHoverIndex(): void {
    this.hideDetails();
    this.hoverUpdated.emit({ userIndex: null, deviceIndex: null });
  }

  public addPermission(): void {
    this.hideDetails();
    this.showSidebar.emit(true);
  }

  private showDetails(): void {
    if (this.user.mappedPermissions[this.device.id].accessLevel === AccessLevel.None) {
      return;
    }
    this.detailsTimer = setTimeout(() => (this.detailsOpen = true), 500);
  }

  private hideDetails(): void {
    clearTimeout(this.detailsTimer);
    this.detailsOpen = false;
  }
}
