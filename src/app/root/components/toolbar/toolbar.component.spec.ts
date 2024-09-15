import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ToolbarComponent } from './toolbar.component';
import { OrganizationContext } from '@app/core';

class OrganizationMockContext {
  public get hasOrganization(): boolean {
    return true;
  }
}

describe('RootModule', () => {
  describe('ToolbarComponent', () => {
    let component: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [ToolbarComponent],
        providers: [
          {
            provide: OrganizationContext,
            useClass: OrganizationMockContext,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ToolbarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should show the sygnet when brand is collapsed', () => {
      component.brandCollapsed = true;
      fixture.detectChanges();
      const toolbarElement: HTMLElement = fixture.nativeElement;
      const logoElement: HTMLImageElement = toolbarElement.querySelector('.toolbar__logo > img');
      expect(logoElement.src).toEqual(window.location.origin + '/assets/images/sygnet.svg');
    });

    it('should show the logo when brand is not collapsed', () => {
      component.brandCollapsed = false;
      fixture.detectChanges();
      const toolbarElement: HTMLElement = fixture.nativeElement;
      const logoElement: HTMLImageElement = toolbarElement.querySelector('.toolbar__logo > img');
      expect(logoElement.src).toEqual(window.location.origin + '/assets/images/logo.svg');
    });

    it('should emit toggle event in output', () => {
      const spy = spyOn(component.toggle, 'emit');
      const toolbarElement: HTMLElement = fixture.nativeElement;
      const togglerElement: HTMLButtonElement = toolbarElement.querySelector('.toolbar__toggler');
      togglerElement.click();
      expect(spy).toHaveBeenCalledWith();
    });
  });
});
