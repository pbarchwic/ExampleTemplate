import { TestBed } from '@angular/core/testing';

import { IconsService } from './icons.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { customIcons } from '@app/shared';

class MatIconRegistryMock {
  public addSvgIcon(): void {}
}

describe('CoreModule', () => {
  describe('IconsService', () => {
    let iconsService: IconsService;
    let matIconRegistry: MatIconRegistry;
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: MatIconRegistry,
            useClass: MatIconRegistryMock,
          },
          {
            provide: DomSanitizer,
            useValue: {
              bypassSecurityTrustResourceUrl: (val: string) => val,
            },
          },
          IconsService,
        ],
      });

      iconsService = TestBed.inject(IconsService);
      matIconRegistry = TestBed.inject(MatIconRegistry);
    });

    it('should create the service', () => {
      expect(iconsService).toBeTruthy();
    });

    it('should register every icon from constants file', () => {
      const spy = spyOn(matIconRegistry, 'addSvgIcon');
      iconsService.registerCustomIcons();
      expect(spy).toHaveBeenCalledTimes(customIcons.length);
    });
  });
});
