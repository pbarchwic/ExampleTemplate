import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { OrganizationService } from './organization.service';
import { OrganizationContext } from '../contexts';
import { Organization } from '../models';

class OrganizationMockContext {
  public organization$: BehaviorSubject<Organization> = new BehaviorSubject<Organization>({ name: 'Test', slug: 'test' } as Organization);
}

describe('CoreModule', () => {
  describe('OrganizationService', () => {
    let service: OrganizationService;
    let organizationContext: OrganizationContext;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          OrganizationService,

          {
            provide: OrganizationContext,
            useClass: OrganizationMockContext,
          },
        ],
      });

      service = TestBed.inject(OrganizationService);
      organizationContext = TestBed.inject(OrganizationContext);
    });

    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should add organization slug to url, if organization is selected', () => {
      const result = service.transformToUrlWithSlug('/just/url');
      expect(result).toEqual('/test/just/url');
    });

    it('should return url, without slug if organization id not selected', () => {
      organizationContext.organization$.next(null);
      const result = service.transformToUrlWithSlug('/just/url');
      expect(result).toEqual('/just/url');
    });
  });
});
