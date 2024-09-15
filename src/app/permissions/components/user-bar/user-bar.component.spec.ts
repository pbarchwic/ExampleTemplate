import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { UserBarComponent } from './user-bar.component';

describe('PermissionsModule', () => {
  describe('UserBarComponent', () => {
    let component: UserBarComponent;
    let fixture: ComponentFixture<UserBarComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [UserBarComponent],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(UserBarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should emit output', () => {
      const spy = spyOn(component.userHovered, 'emit');
      component.updateHoverIndex(66);
      expect(spy).toHaveBeenCalledWith(66);
    });
  });
});
