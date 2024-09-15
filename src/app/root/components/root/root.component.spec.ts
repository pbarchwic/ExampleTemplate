import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppInsightsService, ConfigService } from '@app/core';
import { RootComponent } from './root.component';
import { IconsService, SidebarService } from '@app/shared';
import { MatDialogModule } from '@angular/material/dialog';

class IconsServiceMock {
  public registerCustomIcons(): void {}
}

describe('RootModule', () => {
  describe('RootComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          TranslateModule.forRoot(),
          MatDialogModule
        ],
        providers: [
          Title,
          ConfigService,
          {
            provide: IconsService,
            useClass: IconsServiceMock,
          },
          AppInsightsService,
          SidebarService
        ],
        declarations: [RootComponent],
        schemas: [NO_ERRORS_SCHEMA],
      });
    }));

    it('should create the app', () => {
      const fixture = TestBed.createComponent(RootComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });
  });
});
