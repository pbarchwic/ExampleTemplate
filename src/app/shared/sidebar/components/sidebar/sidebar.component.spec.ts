import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarComponent } from './sidebar.component';
import { SidebarContent } from '../../models';

describe('RootModule', () => {
  describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarComponent],
        imports: [TranslateModule.forRoot()],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SidebarComponent);
      component = fixture.componentInstance;
      // component.content = {} as SidebarContent;
      fixture.detectChanges();
    });

    xit('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
