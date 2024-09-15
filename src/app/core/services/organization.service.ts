import { Injectable } from '@angular/core';
import { OrganizationContext } from '../contexts/organization.context';

@Injectable()
export class OrganizationService {
  constructor(private readonly organizationContext: OrganizationContext) {}

  public transformToUrlWithSlug(url: string): string {
    const organization = this.organizationContext.organization$.value;
    return organization ? `/${organization.slug}${url}` : url;
  }
}
