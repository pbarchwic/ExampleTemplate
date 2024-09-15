import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, UrlSegment } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { OrganizationContext, Organization } from '@app/core';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: 'breadcrumbs.component.html',
  styleUrls: ['breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbs: Breadcrumb[] = [];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly organizationContext: OrganizationContext,
    private readonly translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.setBreadcrumbs();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.setBreadcrumbs());
  }

  private setBreadcrumbs(): void {
    const organization = this.organizationContext.organization$.value;
    if (!organization) {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      return;
    }
    this.breadcrumbs = [this.getOrganizationBreadcrumb(organization), ...this.createBreadcrumbs(this.activatedRoute.root)];
  }

  private getOrganizationBreadcrumb(org: Organization): Breadcrumb {
    return {
      label: org.name,
      url: '/',
    };
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const path: string = child.snapshot.url.map((segment: UrlSegment) => segment.path).join('/');
      if (path !== '') {
        url += `/${path}`;
      }

      const label = child.snapshot.data.title;
      const showInBreadcrumb = child.snapshot.data.showInBreadcrumbs;
      if (label && showInBreadcrumb) {
        breadcrumbs.push({
          label: this.translateService.instant(label),
          url,
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }
}
