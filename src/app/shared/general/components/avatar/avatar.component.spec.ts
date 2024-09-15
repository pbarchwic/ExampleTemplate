import { SafeUrlPipe } from './../../pipes/safe-url.pipe';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AvatarComponent, avatarComponentDefaults } from './avatar.component';

describe('GeneralModule', () => {
  describe('AvatarComponent', () => {
    let fixture: ComponentFixture<AvatarComponent>;
    let avatarComponent: AvatarComponent;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, TranslateModule.forRoot()],
        declarations: [AvatarComponent, SafeUrlPipe],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AvatarComponent);
      avatarComponent = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(avatarComponent).toBeTruthy();
    });

    it('should display provided data', () => {
      const data = {
        color: 'rgb(255, 255, 255)',
        initials: 'AW',
        width: 50,
        height: 50,
        radius: 10,
      };

      avatarComponent.color = data.color;
      avatarComponent.width = data.width;
      avatarComponent.height = data.height;
      avatarComponent.initials = data.initials;
      avatarComponent.radius = data.radius;

      fixture.detectChanges();

      const componentElement: HTMLElement = fixture.nativeElement;
      const avatarElement: HTMLElement = componentElement.querySelector('.avatar');
      expect(avatarElement.textContent.trim()).toEqual(data.initials);
      expect(avatarElement.style.width).toBe(`${data.width}px`);
      expect(avatarElement.style.height).toBe(`${data.height}px`);
      expect(avatarElement.style.backgroundColor).toBe(data.color);
      expect(avatarElement.style.borderRadius).toBe(`${data.radius}px`);
    });

    it('should display image without initials', () => {
      const data = {
        color: 'rgb(255, 255, 255)',
        initials: 'AW',
        image: 'test.jpg',
      };

      avatarComponent.color = data.color;
      avatarComponent.initials = data.initials;
      avatarComponent.image = data.image;

      fixture.detectChanges();

      const componentElement: HTMLElement = fixture.nativeElement;
      const avatarElement: HTMLElement = componentElement.querySelector('.avatar');
      expect(avatarElement.textContent.trim()).toEqual('');

      expect(avatarElement.style.backgroundColor).toBe(data.color);
    });

    it('should display default data', () => {
      const componentElement: HTMLElement = fixture.nativeElement;
      const avatarElement: HTMLElement = componentElement.querySelector('.avatar');
      expect(avatarElement.textContent.trim()).toEqual(avatarComponentDefaults.initials);
      expect(avatarElement.style.width).toBe(`${avatarComponentDefaults.width}px`);
      expect(avatarElement.style.height).toBe(`${avatarComponentDefaults.height}px`);
      expect(avatarElement.style.backgroundColor).toBe(avatarComponentDefaults.color);
      expect(avatarElement.style.borderRadius).toBe(`${avatarComponentDefaults.radius}px`);
    });
  });
});
