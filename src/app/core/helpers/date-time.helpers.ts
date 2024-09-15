export class DateTimeHelpers {
  public static mapDateStringToDate(date: Date | string): Date {
    return typeof date === 'string' ? new Date(date) : date;
  }

  public static mapDateToTime(date: Date): string {
    if (!date) {
      return null;
    }

    const parsedDate = this.mapDateStringToDate(date);
    const hours = `0${parsedDate.getHours()}`.slice(-2);
    const minutes = `0${parsedDate.getMinutes()}`.slice(-2);
    return `${hours}:${minutes}`;
  }

  public static mapDateAndTimeToDateTime(date: Date, time: string): Date {
    const { hours, minutes } = this.splitTime(time);
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
  }

  public static mapTimeToDate(time: string): Date {
    const { hours, minutes } = this.splitTime(time);
    const date = new Date();
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
  }

  public static splitTime(time: string): { hours: number; minutes: number } {
    const splitTime = time.split(':');
    const hours = +splitTime[0];
    const minutes = +splitTime[1];
    return { hours, minutes };
  }
}
