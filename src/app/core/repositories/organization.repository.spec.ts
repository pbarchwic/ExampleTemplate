import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { OrganizationsRepository } from '@app/core';
import * as permission from '@assets/mocks/organization-permissions-locks.json';

describe('CoreModule', () => {
  describe('OrganizationRepository', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let organizationRepository: OrganizationsRepository;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [OrganizationsRepository],
      });

      httpClient = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
      organizationRepository = TestBed.inject(OrganizationsRepository);
    });

    describe('Get organization permisions', () => {
      it('should make call with corect params and return permission for organization', () => {
        organizationRepository
          .getOrganizationPermissionsById(1, {
            deviceType: 1,
            page: 1,
            itemsPerPage: 10,
          })
          .subscribe((response) => expect(response).toEqual(permission.result));

        const req = httpMock.expectOne(`/organization/permissions/1?page=1&itemsPerPage=10&type=1`);
        expect(req.request.method).toBe('GET');
        expect(req.cancelled).toBeFalsy();
        req.flush({ result: permission.result });
        httpMock.verify();
      });
    });
  });
});
