export interface GetUsersCommand {
  organizationId: number;
  page?: number;
  itemsPerPage?: number;
  userTypes?: UserType[];
}

export interface AddUserCommand {
  organizationId: number;
  name: string;
  email: string;
}

export interface UpdateUserCommand {
  organizationId: number;
  organizationUserId: number;
  displayName: string;
}

export interface AssignAdminCommand {
  organizationId: number;
  organizationUserId: number;
}

export interface RemoveAdminCommand {
  organizationId: number;
  organizationUserId: number;
}

export enum UserType {
  Admin = 0,
  Other = 1,
}

export interface GetUserDevicesCommand {
  userId: number;
  page?: number;
  itemsPerPage?: number;
}

export interface GetUserActivitiesCommand {
  userId: number;
  page?: number;
  itemsPerPage?: number;
}
