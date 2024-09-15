import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { UserContext, UserRepository, User, AppInsightsService } from '@app/core';
import { UserResolver } from './user.resolver';

import * as user from '@assets/mocks/user.json';

class UserMockRepository {
  public getProfile(): Observable<User> {
    return of(user.result);
  }
}

describe('RootModule', () => {
  describe('UserResolver', () => {
    let userResolver: UserResolver;
    let userContext: UserContext;
    let userRepository: UserMockRepository;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: UserRepository,
            useClass: UserMockRepository
          },
          UserContext,
          UserResolver,
          AppInsightsService
        ]
      });

      userResolver = TestBed.inject(UserResolver);
      userContext = TestBed.inject(UserContext);
      userRepository = TestBed.inject(UserRepository);
    });

    it(`should return user when the request is successful`, async () => {
      const response = await userResolver.resolve();
      expect(response).toBe(user.result);
    });

    it(`should set the user to the user context when the request is successful`, async () => {
      const spy = spyOn(userContext.user$, 'next');
      const response = await userResolver.resolve();
      expect(spy).toHaveBeenCalledWith(user.result);
    });
  });
});
