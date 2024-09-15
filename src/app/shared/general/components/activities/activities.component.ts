import { Component, Input } from '@angular/core';
import * as moment from 'moment';

import { Activity, CommonActivityEvent, DeviceEventType } from '@app/core';
import { activitiesIconsConfig } from './activities-icons.config';

@Component({
  selector: 'app-activities',
  templateUrl: 'activities.component.html',
  styleUrls: ['activities.component.scss']
})
export class ActivitiesComponent {
  @Input() public readonly activities: Activity<CommonActivityEvent>[];

  public trackByIndex(index: number): number {
    return index;
  }

  public getEventIcon(event: DeviceEventType): string {
    return activitiesIconsConfig[event];
  }

  public isToday(date: string): boolean {
    return moment(date).isSame(new Date(), 'd');
  }

  public isYesterday(date: string): boolean {
    return moment(date).diff(new Date(), 'd') === -1;
  }
}
