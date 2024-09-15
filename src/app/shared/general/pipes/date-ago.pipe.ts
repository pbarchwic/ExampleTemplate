import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {
  constructor(
    private readonly translateService: TranslateService
  ) {
  }

  public transform(value: Date): string {
    const locale = this.translateService.currentLang || this.translateService.defaultLang;
    return moment.utc(value).locale(locale).fromNow();
  }
}
