import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, mergeMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { SidebarService, stylesVariables, IconsService } from '@app/shared';
import { AppInsightsService, ConfigService } from '@app/core';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
})
export class RootComponent {
  public readonly colors = stylesVariables;

  constructor(
    private readonly title: Title,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly iconsService: IconsService,
    private readonly configService: ConfigService,
    private readonly appInsightsService: AppInsightsService,
    private readonly sidebarService: SidebarService
  ) {
    this.setLanguage();
    this.setPageTitle();
    this.iconsService.registerCustomIcons();
    this.appInsightsService.initialize();
    this.closeSidebarAndModalOnNavigation();
  }

  private setLanguage(): void {
    const { defaultLang, langs } = environment;
    this.translateService.setDefaultLang(defaultLang);
    const browserLang = navigator.language;
    const langExists = langs.includes(browserLang);
    this.translateService.use(langExists ? browserLang : defaultLang);
  }

  private setPageTitle(): void {
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        map(() => this.router.routerState.root),
        map((route: ActivatedRoute) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route: ActivatedRoute) => route.outlet === 'primary'),
        mergeMap((route: ActivatedRoute) => route.data)
      )
      .subscribe((data) => {
        if (data.title) {
          const title = this.translateService.instant(data.title);
          this.title.setTitle(`${title} - ${this.configService.appName}`);
        }
      });
  }

  private closeSidebarAndModalOnNavigation(): void {
    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationStart))
      .subscribe(() => {
        this.dialog.closeAll();
        this.sidebarService.close();
      });
  }
}
