import { PermissionDetails, CreatePermissionCommand, UpdatePermissionCommand, DateTimeHelpers, WeekDays, EnumHelpers } from '@app/core';
import { PermissionFormValue } from '../models';

export class AddPermissionMapper {
  public static mapWeekDaysSumToArray(weekDaysSum: number): WeekDays[] {
    let weekDays = EnumHelpers.toArray<number>(WeekDays).sort((a, b) => b - a);
    const selectedWeekDays: number[] = [];

    while (weekDaysSum > 0) {
      weekDays = weekDays.filter((day: number) => {
        if (day <= weekDaysSum) {
          weekDaysSum -= day;
          selectedWeekDays.push(day);
        }

        return false;
      });
    }

    return selectedWeekDays.reverse();
  }

  public static mapWeekDaysArrayToSum(days: WeekDays[]): number {
    return days.reduce((prev, curr) => prev + curr, 0);
  }

  public static mapPermissionDetailsToFormValue(permission: PermissionDetails): PermissionFormValue {
    if (!permission) {
      return;
    }

    const { startDate, endDate, weekDays, dayStartTime, dayEndTime } = permission.repeatEvent;
    return {
      accessDetails: {
        accessLevel: permission.accessLevel,
        remoteAccessDisabled: permission.remoteAccessDisabled,
        accessType: permission.accessType,
        timeDetails: {
          startDate: DateTimeHelpers.mapDateStringToDate(startDate),
          startTime: startDate && DateTimeHelpers.mapDateToTime(startDate) || null,
          endDate: DateTimeHelpers.mapDateStringToDate(endDate),
          endTime: endDate && DateTimeHelpers.mapDateToTime(endDate) || null
        },
        daysDetails: {
          days: this.mapWeekDaysSumToArray(weekDays),
          dailyStartTime: dayStartTime && DateTimeHelpers.mapDateToTime(dayStartTime) || null,
          dailyEndTime: dayEndTime && DateTimeHelpers.mapDateToTime(dayEndTime) || null
        }
      }
    };
  }

  public static mapPermissionToCommand(value: PermissionFormValue): Partial<CreatePermissionCommand> | Partial<UpdatePermissionCommand> {
    const { accessLevel, accessType, remoteAccessDisabled, timeDetails, daysDetails } = value.accessDetails;
    return {
      accessLevel,
      accessType,
      remoteAccessDisabled,
      repeatEvent: {
        startDate: timeDetails && DateTimeHelpers.mapDateAndTimeToDateTime(timeDetails.startDate, timeDetails.startTime),
        endDate: timeDetails && DateTimeHelpers.mapDateAndTimeToDateTime(timeDetails.endDate, timeDetails.endTime),
        dayStartTime: daysDetails && DateTimeHelpers.mapTimeToDate(daysDetails.dailyStartTime ? daysDetails.dailyStartTime : '00:00'),
        dayEndTime: daysDetails && DateTimeHelpers.mapTimeToDate(daysDetails.dailyEndTime ? daysDetails.dailyEndTime : '23:59'),
        weekDays: daysDetails && daysDetails.days && this.mapWeekDaysArrayToSum(daysDetails.days)
      }
    };
  }
}
