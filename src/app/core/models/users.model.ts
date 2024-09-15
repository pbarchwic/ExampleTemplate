import { Entity } from '../models/entity.model';

export interface OrganizationUserProfile extends Entity {
  color: string;
  displayName: string;
  email: string;
  initials: string;
  isOwner: boolean;
}

export interface OrganizationUser extends Entity {
  initials?: string;
  color?: string;
  displayName: string;
  email: string;
  roles?: string[];
  registrationDate?: string;
  status?: UserStatus;
  isOwner: boolean;
  hiddenRoles?: string[];
}

export interface AllUsersResponse {
  organizationUsers: Array<OrganizationUser>;
}

export enum UserStatus {
  Pending = 0,
  Accepted = 1,
}
