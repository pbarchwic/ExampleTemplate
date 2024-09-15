import { PermissionDeviceComponent } from './permission-device.component';
import { OrganizationsRepository, OrganizationContext, PermissionResponse, Organization } from '@app/core';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

class TestPermissionDeviceComponent extends PermissionDeviceComponent {
  protected organizationId = 1;

  constructor(
    protected readonly organizationsRepository: OrganizationsRepository,
    protected readonly organizationContext: OrganizationContext
  ) {
    super();
  }
}
describe('PermissionModule', () => {
  describe('PermissionDeviceComponent', () => {
    let permissionDeviceComponent: TestPermissionDeviceComponent;
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let organizationRepository: OrganizationsRepository;
    let organizationContext: OrganizationContext;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [OrganizationsRepository, OrganizationContext],
      });

      httpClient = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
      organizationRepository = TestBed.inject(OrganizationsRepository);
      organizationContext = TestBed.inject(OrganizationContext);
      permissionDeviceComponent = new TestPermissionDeviceComponent(organizationRepository, organizationContext);
    });

    it('should get organization with correct params', () => {
      const spy = spyOn(organizationRepository, 'getOrganizationPermissionsById').and.returnValue(of({ users: [] } as PermissionResponse));
      const result = permissionDeviceComponent.getPermissions(2);
      expect(spy).toHaveBeenCalledWith(1, {
        deviceType: 2,
        page: 1,
        itemsPerPage: 25
      });
    });

    // it('should load more permissions, if curently not loading and not last page', () => {
    //   const spy = spyOn(organizationRepository, 'getOrganizationPermissionsById');
    //   permissionDeviceComponent.isLoading = false;
    //   permissionDeviceComponent.isLastPage = false;
    //   permissionDeviceComponent.currentPage = 2;
    //   permissionDeviceComponent.getPermissions(1);
    //   expect(spy).toHaveBeenCalled();
    // });

    it('should not load more permissions, if curently loading more', () => {
      const spy = spyOn(organizationRepository, 'getOrganizationPermissionsById');
      permissionDeviceComponent.isLoading = true;
      permissionDeviceComponent.isLastPage = false;
      permissionDeviceComponent.currentPage = 2;
      permissionDeviceComponent.getPermissions(1);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not load more permissions, if last page loaded', () => {
      const spy = spyOn(organizationRepository, 'getOrganizationPermissionsById');
      permissionDeviceComponent.isLoading = false;
      permissionDeviceComponent.isLastPage = true;
      permissionDeviceComponent.currentPage = 2;
      permissionDeviceComponent.getPermissions(1);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
