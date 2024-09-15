import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PermissionDevice, Entity, DeviceType } from '@core/models';

@Component({
  selector: 'app-device-bar',
  templateUrl: 'device-bar.component.html',
  styleUrls: ['./device-bar.component.scss'],
})
export class DeviceBarComponent {
  @Input() devices: PermissionDevice[];
  @Input() deviceType: DeviceType;
  @Input() hoverDeviceIndex: number;
  @Input() transformPx = 0;
  @Input() matrixColWidth: number;
  @Input() isFirstPage: boolean;
  @Input() isLastPage: boolean;
  @Input() isNavigationVisible: boolean;
  @Output() deviceHovered = new EventEmitter<number>();
  @Output() horizontalNavigation = new EventEmitter<string>();

  constructor() {}

  public updateHoverIndex(index: number): void {
    this.deviceHovered.emit(index);
  }

  public trackByIdentificator(index: number, item: Entity): number {
    return item.id;
  }

  public scrollMatrix(direction: string): void {
    this.horizontalNavigation.emit(direction);
  }
}
