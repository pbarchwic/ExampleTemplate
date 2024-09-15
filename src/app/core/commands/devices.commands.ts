export interface GetDevicesCommand {
  organizationId: number;
  page?: number;
  itemsPerPage?: number;
}

export interface AddDevicesCommand {
  organizationId: number;
  assignUsers: boolean;
  devicesIds: number[];
}
