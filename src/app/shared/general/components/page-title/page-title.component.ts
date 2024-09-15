import { Component, Input } from "@angular/core";

const pageTitleDefaults = {
  title: "",
  tooltip: "",
  tooltipPosition: "right",
  tooltipIcon: "example_info",
};
@Component({
  selector: "app-page-title",
  templateUrl: "./page-title.component.html",
  styleUrls: ["./page-title.component.scss"],
})
export class PageTitleComponent {
  @Input() title: string = pageTitleDefaults.title;
  @Input() tooltip: string = pageTitleDefaults.tooltip;
  @Input() tooltipPosition: string = pageTitleDefaults.tooltipPosition;
  @Input() tooltipIcon: string = pageTitleDefaults.tooltipIcon;
  constructor() {}
}
