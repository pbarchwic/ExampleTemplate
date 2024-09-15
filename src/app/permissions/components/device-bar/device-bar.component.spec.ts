import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DeviceBarComponent } from './device-bar.component';
import { Entity } from '@app/core';

describe('PermissionsModule', () => {
  describe('DeviceBarComponent', () => {
    let component: DeviceBarComponent;
    let fixture: ComponentFixture<DeviceBarComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [DeviceBarComponent],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DeviceBarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should emit output', () => {
      const spy = spyOn(component.deviceHovered, 'emit');
      component.updateHoverIndex(66);
      expect(spy).toHaveBeenCalledWith(66);
    });

    it('should emit output with correct direction when navigation button clicked', () => {
      const spy = spyOn(component.horizontalNavigation, 'emit');
      component.scrollMatrix('left');
      expect(spy).toHaveBeenCalledWith('left');
    });

    it('should return item id for track by', () => {
      const result = component.trackByIdentificator(1, { id: 1 } as Entity);
      expect(result).toEqual(1);
    });
  });
});
