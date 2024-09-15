import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SidenavContext } from '@app/core';
import { SidenavService } from '../../services';
import { SidenavItem } from '../../models';
import { SidenavComponent } from './sidenav.component';

class SidenavMockService {
  public readonly sidenavItems$ = new BehaviorSubject<SidenavItem[]>([]);
}

class SidenavContextStub {
  public readonly sidenavToggle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
}

describe('RootModule', () => {
  describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let sidenavContext: SidenavContext;
    let fixture: ComponentFixture<SidenavComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, BrowserAnimationsModule, TranslateModule.forRoot()],
        declarations: [SidenavComponent],
        providers: [
          {
            provide: SidenavService,
            useClass: SidenavMockService,
          },
          {
            provide: SidenavContext,
            useClass: SidenavContextStub,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SidenavComponent);
      component = fixture.componentInstance;
      sidenavContext = TestBed.inject(SidenavContext);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should pass information to context when animation is done', () => {
      const spy = spyOn(sidenavContext.sidenavToggle$, 'next');
      component.collapsed = true;
      component.animationDone();
      expect(spy).toHaveBeenCalledWith(component.collapsed);
    });
  });
});
