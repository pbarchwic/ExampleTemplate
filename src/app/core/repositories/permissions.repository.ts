import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Response, PermissionDetails } from '../models';
import { CreatePermissionCommand, UpdatePermissionCommand } from '../commands';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsRepository {
  constructor(private readonly http: HttpClient) {}

  public getPermissionDetails(userId: number, deviceId: number): Observable<PermissionDetails> {
    return this.http.get<Response<PermissionDetails>>(`/organizationuser/${userId}/${deviceId}`).pipe(map((response) => response.result));
  }

  public createPermission(value: CreatePermissionCommand): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.post<void>('/my/deviceshare', value).subscribe(
        () => resolve(true),
        () => resolve(false)
      );
    });
  }

  public updatePermission(value: UpdatePermissionCommand): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.patch<void>('/my/deviceshare', value).subscribe(
        () => resolve(true),
        () => resolve(false)
      );
    });
  }
}
