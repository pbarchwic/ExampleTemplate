import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User, Response } from '../models';

@Injectable()
export class UserRepository {

  private readonly url: string = '/my/user';

  constructor(
    private readonly http: HttpClient
  ) { }

  public getProfile(): Observable<User> {
    return this.http.get<Response<User>>(this.url)
      .pipe(map((response: Response<User>) => response.result));
  }

}
