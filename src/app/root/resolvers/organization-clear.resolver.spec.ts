import { TestBed } from '@angular/core/testing';

import { OrganizationContext } from '@app/core';
import { OrganizationClearResolver } from './organization-clear.resolver';

class OrganizationMockContext {
  public clear(): void {}
}

describe('RootModule', () => {
  describe('OrganizationClearResolver', () => {
    let organizationClearResolver: OrganizationClearResolver;
    let organizationContext: OrganizationMockContext;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: OrganizationContext,
            useClass: OrganizationMockContext
          },
          OrganizationClearResolver
        ]
      });

      organizationClearResolver = TestBed.inject(OrganizationClearResolver);
      organizationContext = TestBed.inject(OrganizationContext);
    });

    it(`should clear organization context on resolve`, () => {
      const spy = spyOn(organizationContext, 'clear');
      organizationClearResolver.resolve();
      expect(spy).toHaveBeenCalledWith();
    });
  });
});
