import { UserDevicePermission, Dictionary, MappedMatrixPermissions } from '@app/core';
import { permissionIconMapper } from './permission-icon.mapper';
import { permissionColorMapper } from './permission-color.mapper';

export function permissionDevicesMapper(permissions: UserDevicePermission[]): Dictionary<MappedMatrixPermissions> {
  return Object.assign(
    {},
    ...permissions.map((permission) => {
      const {accessLevel, accessType} = permission;
      const icon = permissionIconMapper(accessLevel);
      const color = permissionColorMapper(accessType);
      return {
        [permission.deviceId]: { icon, color, accessLevel, accessType},
      };
    })
  );
}
