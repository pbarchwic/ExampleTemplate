import { OrganizationsRepository, OrganizationContext, PermissionResponse,
  DeviceType, PermissionUser, PermissionDevice, ArrayHelpers } from '@app/core';
import { permissionUsersMapper } from '../../mappers';

export abstract class PermissionDeviceComponent {
  protected abstract readonly organizationsRepository: OrganizationsRepository;
  protected abstract readonly organizationContext: OrganizationContext;
  protected abstract organizationId: number;
  public users: PermissionUser[] = [];
  public devices: PermissionDevice[] = [];
  public currentPage = 0;
  public readonly itemsPerPage = 25;
  public isLastPage = false;
  public isLoading = false;
  public isError = false;

  public refreshPermissions(deviceType: DeviceType): void {
    this.users = [];
    this.devices = [];
    this.isLastPage = false;
    this.isLoading = false;
    this.isError = false;
    this.currentPage = 0;
    this.getPermissions(deviceType);
  }

  public getPermissions(deviceType: DeviceType, nextPage: boolean = true): void {
    if (this.isLastPage || this.isLoading) {
      return;
    }

    if (nextPage) {
      this.currentPage += 1;
    }

    this.isLoading = true;
    this.isError = false;

    this.organizationsRepository.getOrganizationPermissionsById(this.organizationId, {
      deviceType,
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage
    })
      .subscribe((permissions: PermissionResponse) => {
        const mapped = this.mapPermissions(permissions);
        this.devices = mapped.devices;
        this.users = [...this.users, ...mapped.users];
        this.isLoading = false;
        this.isLastPage = this.users.length > 0 && mapped.users.length < this.itemsPerPage;
      }, () => {
        this.isError = true;
        this.isLoading = false;
      });
  }

  private mapPermissions(permissions: PermissionResponse): PermissionResponse {
    return {
      ...permissions,
      devices: ArrayHelpers.sortByProperty(permissions.devices, 'name'),
      users: permissionUsersMapper(permissions.users)
    };
  }
}
