import { Component, Output, EventEmitter, Input } from '@angular/core';
import { OrganizationContext } from '@app/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() brandCollapsed: boolean;
  @Input() togglerOpened: boolean;
  @Input() togglerShown: boolean;
  @Output() toggle = new EventEmitter<void>();

  constructor(private readonly organizationContext: OrganizationContext) {}

  public get hasOrganization(): boolean {
    return this.organizationContext.hasOrganization;
  }
}
