import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { User, UserRepository, UserContext, AppInsightsService } from '@app/core';

@Injectable()
export class UserResolver implements Resolve<User> {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userContext: UserContext,
    private readonly appInsightsService: AppInsightsService
  ) {

  }

  public resolve(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.userRepository.getProfile()
        .subscribe((user: User) => {
          this.userContext.user$.next(user);
          this.appInsightsService.setUserContext(user.identity);
          resolve(user);
        }, () => {
          // TODO: redirect to the error page
          // TODO: write test for this case
          reject();
        });
    });
  }

}
