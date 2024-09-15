import { AccessLevel } from '@app/core';
import { permissionIcons } from '../configs';

export function permissionIconMapper(accessLevel: AccessLevel = AccessLevel.None): string {
  return permissionIcons[accessLevel];
}
