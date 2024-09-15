import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { OrganizationInfoComponent } from './organization-info.component';
import { OrganizationContext } from '@app/core/contexts/organization.context';
import { Organization } from '@app/core';

class OrganizationContextStub {
  public organization$: BehaviorSubject<Organization> = new BehaviorSubject<Organization>(undefined);
}
describe('SidenavModule', () => {
  describe('OrganizationInfoComponent', () => {
    let component: OrganizationInfoComponent;
    let fixture: ComponentFixture<OrganizationInfoComponent>;
    let context: OrganizationContext;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [OrganizationInfoComponent],
        providers: [{ provide: OrganizationContext, useClass: OrganizationContextStub }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(OrganizationInfoComponent);
      component = fixture.componentInstance;
      context = TestBed.inject(OrganizationContext);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should subscribe to organization context onInit', () => {
      const spy = spyOn(context.organization$, 'subscribe');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should use new organization in component', () => {
      const org = { name: 'Test' } as Organization;
      context.organization$.next(org);
      expect(component.organization).toEqual(org);
    });
  });
});
