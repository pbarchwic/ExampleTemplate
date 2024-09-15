import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import {
  Activity,
  ArrayHelpers,
  CommonActivityEvent,
  DeviceActivityResponse,
  DeviceDetails,
  DevicesRepository,
  OrganizationContext,
} from '@app/core';
import { DeviceContext } from '../../contexts';

@Component({
  selector: 'app-device-activities',
  templateUrl: 'device-activities.component.html',
})
export class DeviceActivitiesComponent implements OnInit {
  public device: DeviceDetails;
  public organizationId: number;
  public activities: Activity<CommonActivityEvent>[] = [];
  public itemsPerPage = 15;
  public hasMore = true;
  public isLoading = false;
  public isError = false;
  private lastElemDate: string;

  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly organizationContext: OrganizationContext,
    private readonly deviceContext: DeviceContext
  ) {}

  public ngOnInit(): void {
    this.device = this.deviceContext.device$.value;
    this.organizationId = this.organizationContext.organization$.value.id;
    this.getActivites();
  }

  public refreshActivities(): void {
    this.activities = [];
    this.hasMore = true;
    this.lastElemDate = null;
    this.getActivites();
  }

  public getActivites(): void {
    if (this.isLoading || !this.hasMore || this.isError) {
      return;
    }

    this.isLoading = true;
    this.isError = false;
    this.devicesRepository
      .getDeviceActivities(this.device.id, this.itemsPerPage, this.lastElemDate)
      .pipe(
        tap((response) => {
          this.checkHasMore(response);
          this.setLastElementDate(response);
        }),
        map((response) => this.mapDeviceActivities(response))
      )
      .subscribe(
        (activities) => {
          this.activities = [...this.activities, ...activities];
          this.isLoading = false;
        },
        () => {
          this.isError = true;
          this.isLoading = false;
        }
      );
  }

  private setLastElementDate(response: DeviceActivityResponse[]): void {
    if (!response || !response.length) {
      return;
    }

    this.lastElemDate = response[response.length - 1].date;
  }

  private checkHasMore(response: DeviceActivityResponse[]): void {
    this.hasMore = response && response.length >= this.itemsPerPage;
  }

  private mapDeviceActivities(response: DeviceActivityResponse[]): Activity<CommonActivityEvent>[] {
    const datesObject: { [key: string]: DeviceActivityResponse[] } = response.reduce((obj, event) => {
      const date = event.date.split('T')[0];
      if (!obj[date]) {
        obj[date] = [];
      }

      obj[date].push(event);
      return obj;
    }, {});

    const activities = Object.keys(datesObject).map((key) => {
      const events = datesObject[key].map((event) => {
        return {
          event: event.event,
          date: event.date,
          by: event.username,
          deviceId: event.deviceId,
          userId: event.organizationUserId,
        };
      });

      return {
        date: key,
        events: ArrayHelpers.sortByProperty(events, 'date').reverse(),
      };
    });

    return ArrayHelpers.sortByProperty(activities, 'date').reverse();
  }
}
