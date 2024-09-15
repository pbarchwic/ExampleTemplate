import { Directive, HostListener, Input } from '@angular/core';
import { AppInsightsService, CustomEventTelemetry } from '@app/core';

@Directive
({ selector: '[appTrackEvent]' })
export class TrackEventDirective {
  @Input() appTrackEvent: CustomEventTelemetry;

  constructor(
    private readonly appInsightsService: AppInsightsService
  ) { }

  @HostListener('click', ['$event'])
  private clicked(): void {
    this.appInsightsService.trackCustomEvent(this.appTrackEvent);
  }
}
