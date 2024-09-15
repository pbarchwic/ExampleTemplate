import { AccessType } from '@app/core';
import { permissionColors } from '../configs';

export function permissionColorMapper(accessType: AccessType): string {
  return permissionColors[accessType];
}
