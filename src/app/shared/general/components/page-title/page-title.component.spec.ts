import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PageTitleComponent } from "./page-title.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";

describe("GeneralModule", () => {
  describe("PageTitleComponent", () => {
    let component: PageTitleComponent;
    let fixture: ComponentFixture<PageTitleComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MatTooltipModule, TranslateModule.forRoot()],
        declarations: [PageTitleComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(PageTitleComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should use provided data", () => {
      const data = {
        title: "Test",
        tooltip: "Tooltip",
        tooltipPosition: "top",
        tooltipIcon: "example_info",
      };

      component.title = data.title;
      component.tooltip = data.tooltip;
      component.tooltipPosition = data.tooltipPosition;
      component.tooltipIcon = data.tooltipIcon;

      fixture.detectChanges();

      const componentElement: HTMLElement = fixture.nativeElement;
      const titleElement: HTMLElement =
        componentElement.querySelector(".page-title");
      expect(titleElement.textContent.trim()).toEqual(data.title);
    });
  });
});
