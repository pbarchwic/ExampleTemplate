import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { OrganizationContext, Organization } from '@app/core';
import { SidenavItem } from '../models';
import { sidenavItems } from '../constants';

@Injectable()
export class SidenavService {
  public readonly sidenavItems$ = new BehaviorSubject<SidenavItem[]>([]);

  constructor(private readonly organizationContext: OrganizationContext) {
    this.organizationContext.organization$.subscribe(
      (organization: Organization) => organization && this.sidenavItems$.next(this.mapSidenavItems(sidenavItems, organization.slug))
    );
  }

  private mapSidenavItems(items: SidenavItem[], slug: string): SidenavItem[] {
    if (!items || !items.length) {
      return;
    }

    return items.map((item: SidenavItem) => {
      return {
        ...item,
        route: `/${slug}${item.route}`,
        children: this.mapSidenavItems(item.children, slug),
      };
    });
  }
}
