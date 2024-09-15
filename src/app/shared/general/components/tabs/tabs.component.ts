import { Component, Input } from '@angular/core';

export interface TabItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  @Input() tabs: TabItem[];
  constructor() {}
}
