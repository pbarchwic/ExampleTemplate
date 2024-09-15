import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LanguagesService } from '@app/core';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  constructor(
    private readonly datePipe: DatePipe,
    private readonly translateService: TranslateService,
    private readonly languagesService: LanguagesService
  ) {

  }

  public transform(value: string | Date, format?: string): string {
    const date: Date = typeof value === 'string' ? new Date(value) : value;
    const language = this.translateService.currentLang;
    const languageFormat = this.languagesService.getDateFormatByLanguageName(language);
    const selectedFormat = format || languageFormat;
    return this.datePipe.transform(date, selectedFormat);
  }
}
