import { Component, Input } from '@angular/core';

import { PermissionUser, Entity } from '@app/core';

@Component({
  selector: 'app-vertical-bar',
  templateUrl: 'vertical-bar.component.html',
  styleUrls: ['./vertical-bar.component.scss'],
})
export class VerticalBarComponent {
  @Input() users: PermissionUser[];

  public trackByIdentificator(index: number, item: Entity): number {
    return item.id;
  }
}
