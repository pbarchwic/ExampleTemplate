import { AccessLevel, AccessType, DeviceType } from '@app/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PermissionDetails, PermissionDevice, PermissionsRepository, PermissionUser } from '@app/core';
import { AddPermissionMapper, PermissionFormAccessDetails, PermissionFormValue } from '@app/shared';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-permission-share-details',
  templateUrl: './permission-share-details.component.html',
  styleUrls: ['./permission-share-details.component.scss'],
})
export class PermissionShareDetailsComponent implements OnInit, OnDestroy {
  @Input() user: PermissionUser;
  @Input() device: PermissionDevice;
  @Input() deviceType: DeviceType;
  public isLoading = false;
  public isError = false;
  public data: PermissionFormAccessDetails;
  private subscriptions = new Subscription();
  public accessTypesDisplayName = {
    [AccessType.Permanent]: 'permanet',
    [AccessType.TimeRestricted]: 'time_restricted',
    [AccessType.Recurring]: 'custom',
  };
  public accessLevels = AccessLevel;
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  public ngOnInit(): void {
    this.setDefaultData();
    this.subscriptions.add(this.getPermissionDetails());
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get className(): string {
    return this.data.accessType === AccessType.Permanent
      ? 'permanet'
      : this.data.accessType === AccessType.TimeRestricted
      ? 'timerestricted'
      : 'custom';
  }

  public get isTimeRestricted(): boolean {
    return this.data.accessType === AccessType.TimeRestricted;
  }

  public get isRecurring(): boolean {
    return this.data.accessType === AccessType.Recurring;
  }

  public get isLock(): boolean {
    return this.deviceType === DeviceType.Lock;
  }

  private setDefaultData(): void {
    const { accessLevel, accessType } = this.user.mappedPermissions[this.device.id];
    this.data = {
      ...this.data,
      accessLevel,
      accessType,
    };
  }

  private getPermissionDetails(): Subscription {
    this.isLoading = true;
    return this.permissionsRepository
      .getPermissionDetails(this.user.id, this.device.id)
      .pipe(
        map((response: PermissionDetails) => {
          return AddPermissionMapper.mapPermissionDetailsToFormValue(response);
        })
      )
      .subscribe(
        (details: PermissionFormValue) => {
          this.isLoading = false;
          this.data = details.accessDetails;
        },
        () => {
          this.isLoading = false;
          this.isError = true;
        }
      );
  }
}
