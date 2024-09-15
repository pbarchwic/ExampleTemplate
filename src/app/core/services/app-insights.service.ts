import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import { environment } from '@env/environment';
import { CustomEventTelemetry } from '../models';

@Injectable()
export class AppInsightsService {
  private readonly config = environment.appInsights;
  public readonly enabled: boolean = !!this.config.instrumentationKey;
  public appInsights: Readonly<ApplicationInsights>;

  public initialize(): void {
    if (!this.enabled) {
      return;
    }

    this.appInsights = this.getAppInsights();
    this.appInsights.loadAppInsights();
  }

  public setUserContext(userId: string): void {
    if (!this.enabled) {
      return;
    }

    this.appInsights.setAuthenticatedUserContext(userId);
  }

  public clearUserContext(): void {
    if (!this.enabled) {
      return;
    }

    this.appInsights.clearAuthenticatedUserContext();
  }

  public trackCustomEvent(event: CustomEventTelemetry): void {
    if (!this.enabled) {
      return;
    }

    const properties: Partial<CustomEventTelemetry> = {
      component: event.component
    };

    if (event.place) {
      properties.place = event.place;
    }

    this.appInsights.trackEvent({ name: event.name }, properties);
    this.appInsights.flush();
  }

  private getAppInsights(): ApplicationInsights {
    return new ApplicationInsights({
      config: {
        instrumentationKey: this.config.instrumentationKey,
        enableAutoRouteTracking: this.config.enableAutoRouteTracking,
        autoTrackPageVisitTime: this.config.autoTrackPageVisitTime,
        enableRequestHeaderTracking: this.config.enableRequestHeaderTracking,
        enableResponseHeaderTracking: this.config.enableResponseHeaderTracking
      }
    });
  }
}
