import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  Router,
  RouterEvent,
  NavigationEnd,
  NavigationStart,
} from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { StorageService, OrganizationContext } from "@app/core";
import {
  SidebarService,
  MediaQueryService,
  MediaQueryBreakpoint,
} from "@app/shared";

@Component({
  selector: "app-layout",
  templateUrl: "layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, OnDestroy {
  public sidenavCollapsed =
    this.storageService.getItem("example.menu.mode") === "1";
  public sidenavOpened = false;
  public sidebarOpened = false;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly storageService: StorageService,
    private readonly mediaQueryService: MediaQueryService,
    private readonly organizationContext: OrganizationContext,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(this.onSidebarToggled());

    this.onNavigation(
      (event: RouterEvent) => event instanceof NavigationStart
    ).subscribe(() => this.closeSidenav());
    this.onNavigation(
      (event: RouterEvent) => event instanceof NavigationEnd
    ).subscribe(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  public closeSidenav(): void {
    this.sidenavOpened = false;
  }

  public collapseSidenav(): void {
    this.sidenavCollapsed = !this.sidenavCollapsed;
    this.storageService.setItem(
      "example.menu.mode",
      `${+this.sidenavCollapsed}`
    );
  }

  public get isMobile(): boolean {
    return this.mediaQueryService.is(
      (breakpoint: MediaQueryBreakpoint) =>
        breakpoint <= MediaQueryBreakpoint.Small
    );
  }

  public get hasOrganization(): boolean {
    return this.organizationContext.hasOrganization;
  }

  public get sidenavHidden(): boolean {
    return (this.isMobile && !this.sidenavOpened) || !this.hasOrganization;
  }

  public get contentHidden(): boolean {
    return this.sidenavOpened && this.isMobile && this.hasOrganization;
  }

  private onSidebarToggled(): Subscription {
    return this.sidebarService.openedChange.subscribe((opened: boolean) => {
      this.sidebarOpened = opened;
      document.body.style.overflow = opened ? "hidden" : "initial";
    });
  }

  private onNavigation(
    predicate: (event: RouterEvent) => boolean
  ): Observable<RouterEvent> {
    return this.router.events.pipe(filter(predicate));
  }
}
