import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';

import { AppInsightsService, CustomEventActionType, CustomEventsConfig } from '@app/core';

export type ContextualMenuItemType = 'default' | 'danger';

export interface ContextualMenuItem {
  label: string;
  action: string;
  theme: ContextualMenuItemType;
  order?: number;
}

@Component({
  selector: 'app-contextual-menu',
  templateUrl: './contextual-menu.component.html',
  styleUrls: ['./contextual-menu.component.scss'],
})
export class ContextualMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() menuName: string;
  @Input() items: ContextualMenuItem[] = [];
  @Output() action = new EventEmitter<string>();
  @ViewChild('contextMenuToggler') public readonly matMenuTrigger: MatMenuTrigger;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly appInsightsService: AppInsightsService
  ) {

  }

  public ngOnInit(): void {
    this.items = this.items.sort((a, b) => a.order && b.order && a.order - b.order);
  }

  public ngAfterViewInit(): void {
    this.subscriptions.add(this.matMenuTrigger.menuOpened.subscribe(() => this.trackMenuEvent('opened')));
    this.subscriptions.add(this.matMenuTrigger.menuClosed.subscribe(() => this.trackMenuEvent('closed')));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onAction(itemAction: string): void {
    const eventName = CustomEventsConfig.events.getEventNameForContextMenuAction(this.menuName, itemAction);
    this.appInsightsService.trackCustomEvent({
      name: eventName,
      component: CustomEventsConfig.components.contextMenu
    });

    this.action.emit(itemAction);
  }

  private trackMenuEvent(action: CustomEventActionType): void {
    const eventName = CustomEventsConfig.events.getEventNameForContextMenu(this.menuName, action);
    this.appInsightsService.trackCustomEvent({
      name: eventName,
      component: CustomEventsConfig.components.contextMenu
    });
  }
}
