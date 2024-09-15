import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AppInsightsService, CustomEventsConfig } from '@app/core';

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: 'modal-wrapper.component.html',
  styleUrls: ['modal-wrapper.component.scss'],
})
export class ModalWrapperComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() loading: boolean;
  @Input() hideCloseButton = false;
  @Output() closed = new EventEmitter<void>();

  constructor(
    private readonly translateService: TranslateService,
    private readonly appInsights: AppInsightsService
  ) {

  }

  public ngOnInit(): void {
    this.trackEvent('opened');
  }

  public ngOnDestroy(): void {
    this.trackEvent('closed');
  }

  private trackEvent(action: 'closed' | 'opened'): void {
    const key = this.getKeyFromTranslations(this.title);
    if (!key) {
      return;
    }

    const eventName = CustomEventsConfig.events.getEventNameForDialog(key, action);
    this.appInsights.trackCustomEvent({
      name: eventName,
      component: CustomEventsConfig.components.dialog
    });
  }

  private getKeyFromTranslations(translationValue: string): string {
    const currentLang = this.translateService.currentLang;
    const translations: { [key: string]: string } = this.translateService.translations[currentLang];
    return Object.keys(translations).find((key: string) => {
      return translations[key] === translationValue;
    });
  }
}
