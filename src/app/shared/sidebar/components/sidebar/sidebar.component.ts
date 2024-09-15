import { sidebarAnimation } from '../../animations';
import { Component, ViewChild, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ContentComponent } from './content.class';
import { SidebarContent } from '../../models';
import { SidebarContentDirective } from '../../directives';
import { SidebarService } from '../../services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [sidebarAnimation],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild(SidebarContentDirective, { static: true }) sidebarContent: SidebarContentDirective;
  private readonly subscriptions = new Subscription();
  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver, private readonly sidebarService: SidebarService) {}

  public ngOnInit(): void {
    this.subscriptions.add(this.sidebarService.content.subscribe((content: SidebarContent) => content && this.loadComponent(content)));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public animationDone(): void {
    this.sidebarService.animationDone.emit(true);
  }

  private loadComponent(content: SidebarContent): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(content.component);

    const viewContainerRef = this.sidebarContent.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as ContentComponent).data = content.data;
  }
}
