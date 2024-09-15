import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AppInsightsService, CustomEventsConfig } from '@app/core';

@Component({
  selector: 'app-router-tracking',
  templateUrl: 'router-tracking.component.html'
})
export class RouterTrackingComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly appInsightsService: AppInsightsService
  ) {}

  public ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.trackRouterEvent());
  }

  private trackRouterEvent(): void {
    const paths = this.createPath(this.activatedRoute.root);
    const urlPath = paths.join('.');
    const eventName = CustomEventsConfig.events.getEventNameForPageView(urlPath);
    if (!this.appInsightsService.enabled) {
      return;
    }
    this.appInsightsService.appInsights.trackPageView({
      name: eventName,
      uri: urlPath
    });
    this.appInsightsService.appInsights.flush();
  }

  private createPath(route: ActivatedRoute, paths: string[] = []): string[] {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return paths;
    }

    for (const child of children) {
      const path: string = child.snapshot.url.map((segment) => segment.path).join('/');
      if (!child.snapshot.data.skipTracking && path !== '') {
        paths.push(path);
      }
      return this.createPath(child, paths);
    }
  }
}
