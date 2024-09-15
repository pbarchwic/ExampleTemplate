import { Entity } from './entity.model';

export interface Organization extends Entity {
  name: string;
  slug: string;
  color: string;
  initials: string;
  logo: string;
  ownerName: string;
  bridgesCount: number;
  locksCount: number;
  description: string;
  permissions?: OrganizationPermission;
}

export interface OrganizationPermission {
  canBeDeletedByCurrentUser: boolean;
}

export interface OrganizationResponse {
  organizations: Array<Organization>;
}
