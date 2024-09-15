import { Injectable } from '@angular/core';

export interface Language {
  name: string;
  dateFormat: string;
  dateTimeFormat: string;
  timeFormat: string;
}

@Injectable()
export class LanguagesService {
  public readonly languages: Language[] = [
    {
      name: 'en',
      dateFormat: 'M/d/yyyy',
      dateTimeFormat: 'M/d/yyyy HH:mm',
      timeFormat: 'HH:mm'
    },
    {
      name: 'pl',
      dateFormat: 'dd.MM.yyyy',
      dateTimeFormat: 'dd.MM.yyyy HH:mm',
      timeFormat: 'HH:mm'
    },
    {
      name: 'de',
      dateFormat: 'dd.MM.yyyy',
      dateTimeFormat: 'dd.MM.yyyy HH:mm',
      timeFormat: 'HH:mm'
    },
    {
      name: 'dk',
      dateFormat: 'yyyy-MM-dd',
      dateTimeFormat: 'yyyy-MM-dd HH:mm',
      timeFormat: 'HH:mm'
    },
    {
      name: 'nl',
      dateFormat: 'dd-MM-yyyy',
      dateTimeFormat: 'dd-MM-yyyy HH:mm',
      timeFormat: 'HH:mm'
    },
    {
      name: 'fr',
      dateFormat: 'dd/MM/yyyy',
      dateTimeFormat: 'dd/MM/yyyy HH:mm',
      timeFormat: 'HH:mm'
    }
  ];

  public getLanguageByName(name: string): Language {
    return this.languages.find(lang => lang.name === name);
  }

  public getDateFormatByLanguageName(name: string): string {
    return this.getLanguageByName(name).dateFormat;
  }

  public getDateTimeFormatByLanguageName(name: string): string {
    return this.getLanguageByName(name).dateTimeFormat;
  }

  public getTimeFormatByLanguageName(name: string): string {
    return this.getLanguageByName(name).timeFormat;
  }
}
