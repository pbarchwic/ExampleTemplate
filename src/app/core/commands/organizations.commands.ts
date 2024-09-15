export interface CreateOrganizationCommand {
  name: string;
  description: string;
  logo: File;
}

export interface UpdateOrganizationCommand {
  id: number;
  name: string;
  description: string;
  slug: string;
  logo: File;
}
