import { Directive, ElementRef, AfterViewChecked, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';

@Directive({
  selector: '[appEqualHeight]',
})
export class EqualHeightDirective implements OnInit, AfterViewChecked, OnDestroy {
  @Input() appEqualHeight: string;
  private readonly subscriptions = new Subscription();

  constructor(private readonly el: ElementRef, private readonly renderer2: Renderer2) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      of(this.renderer2.listen('document', 'resize', () => {}))
        .pipe(debounceTime(1500))
        .subscribe(() => this.matchHeight(this.el.nativeElement, this.appEqualHeight))
    );
  }

  public ngAfterViewChecked(): void {
    this.matchHeight(this.el.nativeElement, this.appEqualHeight);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private matchHeight(parent: HTMLElement, className: string): void {
    if (!parent) {
      return;
    }
    const children = Array.from(parent.getElementsByClassName(className));

    if (children.length === 0) {
      return;
    }
    const maxHeight = children.map((child: HTMLElement) => this.getHeight(child)).reduce((prev, curr) => this.getMaxHeight(prev, curr), 0);

    children.forEach((child: HTMLElement) => (child.style.height = `${maxHeight}px`));
  }

  private getHeight(element: HTMLElement): number {
    element.style.height = 'initial';
    return element.getBoundingClientRect().height;
  }

  private getMaxHeight(prev: number, curr: number): number {
    return curr > prev ? curr : prev;
  }
}
