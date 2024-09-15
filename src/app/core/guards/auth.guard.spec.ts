import { TestBed, async } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

class AuthMockService {
  public checkIsAuthenticated(): boolean | void {}
  public signIn(): void {}
  public checkIsInProgress(): boolean | void {}
  public getToken(): string {
    return 'access_token';
  }
  public refreshToken(): Promise<void> | void {}
}

describe('CoreModule', () => {
  describe('AuthGuard', () => {
    let authService: AuthService;
    let authGuard: AuthGuard;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AuthService,
            useClass: AuthMockService
          },
          AuthGuard
        ]
      });

      authService = TestBed.inject(AuthService);
      authGuard = TestBed.inject(AuthGuard);
    }));

    it('should create the guard', () => {
      expect(authGuard).toBeTruthy();
    });

    it('should return false if sign in is in progress', async () => {
      spyOn(authService, 'checkIsInProgress').and.returnValue(true)();
      const result = await authGuard.canActivate();
      expect(result).toBe(false);
    });

    it('should get an access token for authenticated user', async () => {
      spyOn(authService, 'checkIsInProgress').and.returnValue(false)();
      spyOn(authService, 'getToken').and.returnValue('')();
      const result = await authGuard.canActivate();
      expect(result).toBe(true);
    });
  });
});
