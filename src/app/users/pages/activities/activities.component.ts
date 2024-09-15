import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import {
  Activity,
  ArrayHelpers,
  CommonActivityEvent,
  OrganizationContext,
  OrganizationUser,
  UserActivityEvent,
  UserActivityResponse,
  UsersRepository,
} from '@app/core';
import { OrganizationUserContext } from '../../contexts';

@Component({
  selector: 'app-user-activities',
  templateUrl: 'activities.component.html',
})
export class UserActivitiesComponent implements OnInit {
  public user: OrganizationUser;
  public organizationId: number;
  public activities: Activity<CommonActivityEvent>[] = [];
  public currentPage = 0;
  public itemsPerPage = 15;
  public isLastPage: boolean;
  public isLoading = false;
  public isError = false;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly organizationContext: OrganizationContext,
    private readonly organizationUserContext: OrganizationUserContext
  ) {}

  public ngOnInit(): void {
    this.user = this.organizationUserContext.user$.value;
    this.organizationId = this.organizationContext.organization$.value.id;
    this.getActivites();
  }

  public refreshActivities(): void {
    this.activities = [];
    this.currentPage = 0;
    this.isLastPage = false;
    this.getActivites();
  }

  public getActivites(): void {
    if (this.isLoading || this.isLastPage) {
      return;
    }

    this.currentPage += 1;
    this.isLoading = true;
    this.isError = false;
    this.usersRepository
      .getUserActivities({
        userId: this.user.id,
        page: this.currentPage,
        itemsPerPage: this.itemsPerPage,
      })
      .pipe(map((response) => this.mapUserActivities(response)))
      .subscribe(
        (activities) => {
          this.isLastPage = this.currentPage > 1 && activities.length < this.itemsPerPage;
          this.activities = [...this.activities, ...activities];
          this.isLoading = false;
        },
        () => {
          this.isError = true;
          this.isLoading = false;
        }
      );
  }

  private mapUserActivities(response: UserActivityResponse): Activity<CommonActivityEvent>[] {
    const datesObject: { [key: string]: UserActivityEvent[] } = response.events.reduce((obj, event) => {
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
          title: event.deviceName,
          deviceId: event.deviceId,
          deviceType: event.deviceType,
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
