import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { UserContext } from '@app/core';
import { UserMenuComponent } from './user-menu.component';
import { AuthService } from '@app/core';
import { MediaQueryService } from '@app/shared';

class AuthMockService {
  public signOut(): void {}
}

class UserMockContext {
  public user$ = new BehaviorSubject({});
}

describe('RootModule', () => {
  describe('UserMenuComponent', () => {
    let component: UserMenuComponent;
    let fixture: ComponentFixture<UserMenuComponent>;
    let userContext: UserMockContext;
    let authService: AuthMockService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), MatMenuModule],
        declarations: [UserMenuComponent],
        providers: [
          {
            provide: AuthService,
            useClass: AuthMockService,
          },
          {
            provide: UserContext,
            useClass: UserMockContext,
          },
          MediaQueryService,
        ],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(UserMenuComponent);
      component = fixture.componentInstance;
      userContext = TestBed.inject(UserContext);
      authService = TestBed.inject(AuthService);
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should get user from context during initialization', () => {
      const spy = spyOn(userContext.user$, 'getValue');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith();
    });

    it('should logout current user', () => {
      const spy = spyOn(authService, 'signOut');
      component.logout();
      expect(spy).toHaveBeenCalledWith();
    });
  });
});
