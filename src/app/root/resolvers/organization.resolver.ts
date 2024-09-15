import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Organization, OrganizationsRepository, OrganizationContext } from '@app/core';
import { ErrorService } from '@app/shared';

@Injectable()
export class OrganizationResolver implements Resolve<Organization> {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly organizationContext: OrganizationContext,
    private readonly errorService: ErrorService
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Promise<Organization> {
    const slug: string = route.paramMap.get('organizationSlug');

    return new Promise((resolve, reject) => {
      this.organizationsRepository.getOrganizationDetailsBySlug(slug).subscribe(
        (organization: Organization) => {
          this.organizationContext.organization$.next(organization);
          resolve(organization);
        },
        (error) => {
          this.errorService.open404(error);
          // TODO: write test for this case
          reject();
        }
      );
    });
  }
}
