import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { OrganizationsRepository, OrganizationContext, DeviceType } from '@app/core';
import { PermissionDeviceComponent } from '../../components';
import { MatrixService } from '@app/permissions/services';

@Component({
  selector: 'app-permissions',
  templateUrl: 'permissions.component.html',
  styleUrls: ['permissions.component.scss']
})
export class PermissionsComponent extends PermissionDeviceComponent implements OnInit, OnDestroy {
  public deviceType: DeviceType;
  protected organizationId: number;
  private subscriptions = new Subscription();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    protected readonly organizationsRepository: OrganizationsRepository,
    protected readonly organizationContext: OrganizationContext,
    private readonly matrixService: MatrixService
  ) {
    super();
    this.organizationId = this.organizationContext.organization$.value.id;
  }

  public ngOnInit(): void {
    this.deviceType = this.activatedRoute.snapshot.data.deviceType;
    this.getPermissions(this.deviceType);
    this.subscriptions.add(
      this.matrixService.forceRefreshPermissions$
        .subscribe(() => this.refreshPermissions(this.deviceType))
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
