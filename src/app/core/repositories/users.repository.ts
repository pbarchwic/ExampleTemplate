import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Response, AllUsersResponse, OrganizationUserDevicesResponse,
  OrganizationUserProfile, UserActivityResponse } from '../models';
import { AddUserCommand, GetUserDevicesCommand, GetUsersCommand, UpdateUserCommand,
  GetUserActivitiesCommand, AssignAdminCommand, RemoveAdminCommand } from '../commands';

@Injectable()
export class UsersRepository {
  private readonly url: string = '/organizationuser';

  constructor(private readonly http: HttpClient) {}

  public getAllUsers(command: GetUsersCommand): Observable<AllUsersResponse> {
    const pagination = command.page && command.itemsPerPage ? `?page=${command.page}&itemsPerPage=${command.itemsPerPage}` : '';
    const params: { [key: string]: any } = {};
    if (command.userTypes) {
      params.userTypes = command.userTypes;
    }

    return this.http
      .get<Response<AllUsersResponse>>(`${this.url}/${command.organizationId}${pagination}`, { params })
      .pipe(map((response: Response<AllUsersResponse>) => response.result));
  }

  public deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  public addUser(data: AddUserCommand): Observable<void> {
    return this.http.post<void>(this.url, data);
  }

  public updateUser(data: UpdateUserCommand): Observable<void> {
    return this.http.put<void>(this.url, data);
  }

  public getOrganizationUser(userId: number | string): Observable<OrganizationUserProfile> {
    const url = `/organizationuser/${userId}/profile`;
    return this.http.get<Response<OrganizationUserProfile>>(url)
      .pipe(map((response: Response<OrganizationUserProfile>) => response.result));
  }

  public getUserDevices(command: GetUserDevicesCommand): Observable<OrganizationUserDevicesResponse> {
    const url = `/organizationuser/${command.userId}/devices?page=${command.page}&itemsPerPage=${command.itemsPerPage}`;
    return this.http.get<Response<OrganizationUserDevicesResponse>>(url)
      .pipe(map((response: Response<OrganizationUserDevicesResponse>) => response.result));
  }

  public getUserActivities(command: GetUserActivitiesCommand): Observable<UserActivityResponse> {
    const url = `/organizationuser/${command.userId}/activities?page=${command.page}&itemsPerPage=${command.itemsPerPage}`;
    return this.http.get<Response<UserActivityResponse>>(url)
      .pipe(map(response => response.result));
  }

  public assignAdmin(data: AssignAdminCommand): Observable<void> {
    return this.http.put<void>(`${this.url}/assignadmin`, data);
  }

  public removeAdmin(data: RemoveAdminCommand): Observable<void> {
    return this.http.put<void>(`${this.url}/removeadmin`, data);
  }
}
