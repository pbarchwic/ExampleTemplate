import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { OrganizationContext } from '@app/core';

@Injectable()
export class OrganizationClearResolver implements Resolve<void> {
  constructor(
    private readonly organizationContext: OrganizationContext
  ) {

  }

  public resolve(): void {
    this.organizationContext.clear();
  }
}
