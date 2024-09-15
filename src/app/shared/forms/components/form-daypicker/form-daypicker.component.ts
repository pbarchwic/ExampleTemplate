import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Dictionary, WeekDays } from '@app/core';

@Component({
  selector: 'app-daypicker',
  templateUrl: 'form-daypicker.component.html',
  styleUrls: ['form-daypicker.component.scss'],
})
export class FormDaypickerComponent {
  @Input() control: FormControl;
  @Input() minSelected = 1;
  @Input() isReadOnly = false;
  @Input() daysList: Array<WeekDays>;

  public dayDisplayName: Dictionary<string> = {
    [WeekDays.Monday]: 'monday_short',
    [WeekDays.Tuesday]: 'tuesday_short',
    [WeekDays.Wednesday]: 'wednesday_short',
    [WeekDays.Thursday]: 'thursday_short',
    [WeekDays.Friday]: 'friday_short',
    [WeekDays.Saturday]: 'saturday_short',
    [WeekDays.Sunday]: 'sunday_short',
  };
  public days: WeekDays[] = [
    WeekDays.Monday,
    WeekDays.Tuesday,
    WeekDays.Wednesday,
    WeekDays.Thursday,
    WeekDays.Friday,
    WeekDays.Saturday,
    WeekDays.Sunday,
  ];

  public isSelected(day: number): boolean {
    if (this.isReadOnly) {
      return this.daysList.includes(day);
    }
    return this.control && this.control.value.includes(day);
  }

  public onClick(day: number): void {
    if (this.isReadOnly) {
      return;
    }
    const indexOfDay = this.control.value.indexOf(day);
    indexOfDay > -1 ? this.deselectDay(day) : this.selectDay(day);
  }

  private selectDay(day: number): void {
    if (this.isReadOnly) {
      return;
    }
    this.control.value.push(day);
  }

  private deselectDay(day: number): void {
    if (this.isReadOnly) {
      return;
    }
    if (this.control.value.length > this.minSelected) {
      const index = this.control.value.indexOf(day);
      this.control.value.splice(index, 1);
    }
  }
}
