import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Organization, OrganizationResponse, Response, Entity, PermissionResponse, PermissionOptions } from '../models';
import { CreateOrganizationCommand, UpdateOrganizationCommand } from '../commands';

@Injectable()
export class OrganizationsRepository {
  private readonly url: string = '/organization';

  constructor(private readonly http: HttpClient) {}

  public getOrganizations(): Observable<Array<Organization>> {
    return this.http
      .get<Response<OrganizationResponse>>(this.url)
      .pipe(map((response: Response<OrganizationResponse>) => response.result.organizations));
  }

  public createOrganization(data: CreateOrganizationCommand): Observable<Entity> {
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Description', data.description);
    formData.append('Logo', data.logo);

    return this.http.post<Response<Entity>>(this.url, formData).pipe(map((response: Response<Entity>) => response.result));
  }

  public updateOrganization(data: UpdateOrganizationCommand): Observable<void> {
    const formData = new FormData();
    formData.append('Id', `${data.id}`);
    formData.append('Name', data.name);
    formData.append('Description', data.description);
    formData.append('slug', data.slug);
    formData.append('logo', data.logo);
    return this.http.put<void>(this.url, formData);
  }

  public removeLogo(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.delete<void>(`${this.url}/${id}/logo`).subscribe(
        () => resolve(true),
        () => resolve(false)
      );
    });
  }

  public getOrganizationDetailsById(id: number): Observable<Organization> {
    return this.http.get<Response<Organization>>(`${this.url}/${id}`).pipe(map((response: Response<Organization>) => response.result));
  }

  public getOrganizationDetailsBySlug(slug: string): Observable<Organization> {
    return this.http
      .get<Response<Organization>>(`${this.url}/slug/${slug}`)
      .pipe(map((response: Response<Organization>) => response.result));
  }

  public getOrganizationPermissionsById(id: number, options: PermissionOptions): Observable<PermissionResponse> {
    const { page, itemsPerPage, deviceType } = options;
    const url = `${this.url}/permissions/${id}?page=${page}&itemsPerPage=${itemsPerPage}&type=${deviceType}`;
    return this.http.get<Response<PermissionResponse>>(url).pipe(map((response: Response<PermissionResponse>) => response.result));
  }

  public deleteOrganization(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
