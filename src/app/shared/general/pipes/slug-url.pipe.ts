import { Pipe, PipeTransform } from '@angular/core';

import { OrganizationService } from '@app/core';

@Pipe({
  name: 'slugUrl',
})
export class SlugUrlPipe implements PipeTransform {
  constructor(private readonly organizationService: OrganizationService) {}

  public transform(value: string): string {
    return this.organizationService.transformToUrlWithSlug(value);
  }
}
