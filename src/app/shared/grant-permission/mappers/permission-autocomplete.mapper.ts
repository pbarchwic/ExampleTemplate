import { FormAutocompleteItem } from '@app/shared';
import { Device, OrganizationUser, AllDevice } from '@app/core';

export class PermissionAutocompleteMapper {
  public static mapDevicesForAutocomplete(devices: Device<AllDevice>[]): FormAutocompleteItem[] {
    return devices.map((device) => {
      return {
        id: device.id,
        name: device.name,
        helperData: `enum_deviceType_${device.type}`,
        type: device.type,
      };
    });
  }

  public static mapUsersForAutocomplete(users: OrganizationUser[]): FormAutocompleteItem[] {
    return users.map((user) => {
      return {
        id: user.id,
        name: user.displayName,
        helperData: user.email,
        value: user.email
      };
    });
  }
}
