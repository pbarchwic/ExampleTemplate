import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { OrganizationContext, Organization } from '@app/core';
import { SidenavNavigateEvent } from '../../models';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss'],
})
export class OrganizationInfoComponent implements OnInit, OnDestroy {
  @Output() menuNavigate = new EventEmitter<SidenavNavigateEvent>();
  public organization: Organization;
  private readonly subscriptions = new Subscription();
  constructor(private readonly organizationContext: OrganizationContext) {}

  public ngOnInit(): void {
    this.subscriptions.add(this.organizationContext.organization$.subscribe((organization) => (this.organization = organization)));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public navigate(event: MouseEvent, route: string): void {
    this.menuNavigate.emit({
      mouseEvent: event,
      route
    });
  }
}
