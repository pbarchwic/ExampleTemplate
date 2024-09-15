import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AppInsightsService, CustomEventsConfig } from '@app/core';
import { SidebarService } from '../../services';

@Component({
  selector: 'app-sidebar-content',
  templateUrl: 'sidebar-content.component.html',
  styleUrls: ['sidebar-content.component.scss']
})
export class SidebarContentComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() loading: boolean;

  constructor(
    private readonly sidebarService: SidebarService,
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

  public close(): void {
    this.sidebarService.close();
  }

  private trackEvent(action: 'closed' | 'opened'): void {
    const key = this.getKeyFromTranslations(this.title);
    if (!key) {
      return;
    }

    const eventName = CustomEventsConfig.events.getEventNameForSidebar(key, action);
    this.appInsights.trackCustomEvent({
      name: eventName,
      component: CustomEventsConfig.components.sidebar
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
