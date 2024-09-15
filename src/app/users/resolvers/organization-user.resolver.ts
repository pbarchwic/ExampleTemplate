import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { UsersRepository } from '@app/core';
import { OrganizationUserContext } from '../contexts';

@Injectable()
export class OrganizationUserResolver implements Resolve<void> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly organizationUserContext: OrganizationUserContext
  ) {
  }

  public resolve(route: ActivatedRouteSnapshot): Promise<void> {
    const userId: string = route.paramMap.get('userId');

    return new Promise((resolve, reject) => {
      this.usersRepository.getOrganizationUser(userId)
        .subscribe((user) => {
          this.organizationUserContext.user$.next(user);
          resolve();
        }, () => {
          // TODO: redirect to the error page
          // TODO: write test for this case
          reject();
        });
    });
  }
}
