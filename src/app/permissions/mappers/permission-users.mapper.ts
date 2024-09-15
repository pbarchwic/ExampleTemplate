import { PermissionUser, AccessLevel, AccessType } from '@app/core';
import { permissionDevicesMapper } from './permission-devices.mapper';

export function permissionUsersMapper(users: PermissionUser[]): PermissionUser[] {
  return users.map((user) => {
    const devicesPermission = user.devicesPermission.map((permission) => {
      return {
        ...permission,
        accessLevel: permission.accessLevel === null ? AccessLevel.None : permission.accessLevel,
        accessType: permission.accessType === null ? AccessType.None : permission.accessType
      };
    });

    return {
      ...user,
      devicesPermission,
      mappedPermissions: permissionDevicesMapper(devicesPermission)
    };
  });
}
