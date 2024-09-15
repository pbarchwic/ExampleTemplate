import { Router } from '@angular/router';

import { SidenavItem } from '../../models';

export abstract class MenuBaseComponent {
  protected abstract readonly router: Router;

  public isActive(route: string): boolean {
    return this.router.isActive(route, false);
  }

  public hasChildren(item: SidenavItem): boolean {
    return item.children && item.children.length > 0;
  }

  public displayChildren(item: SidenavItem): boolean {
    let displayChildren = false;
    if (!item.hasOwnProperty('children') || item.children.length === 0) {
      return displayChildren;
    }

    item.children.forEach((child) => {
      if (this.router.url.includes(child.route)) {
        displayChildren = true;
        return;
      }
    });

    return displayChildren;
  }

  public toggleSubMenu(event: MouseEvent, show: boolean): void {
    event.preventDefault();
    const element = (event.target as Element).querySelector('.subItemsMenu');
    if (element) {
      element.classList.remove(show ? 'd-none' : 'd-block');
      element.classList.add(show ? 'd-block' : 'd-none');
    }
  }
}
