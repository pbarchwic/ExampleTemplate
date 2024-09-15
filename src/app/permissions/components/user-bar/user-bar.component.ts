import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PermissionUser, Entity } from '@core/models';

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.scss'],
})
export class UserBarComponent {
  @Input() users: PermissionUser[];
  @Input() hoverUserIndex: number;
  @Output() userHovered = new EventEmitter<number>();

  constructor() {}

  public updateHoverIndex(index: number): void {
    this.userHovered.emit(index);
  }

  public trackByIdentificator(index: number, item: Entity): number {
    return item.id;
  }
}
