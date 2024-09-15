import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

export enum MediaQueryBreakpoint {
  ExtraSmall = 0,
  Small = 1,
  Medium = 2,
  Large = 3,
  ExtraLarge = 4
}

const queries: { [key: number]: string[] } = {
  [MediaQueryBreakpoint.ExtraSmall]: ['(max-width: 575px)'],
  [MediaQueryBreakpoint.Small]: ['(min-width: 576px)', '(max-width: 767px)'],
  [MediaQueryBreakpoint.Medium]: ['(min-width: 768px)', '(max-width: 991px)'],
  [MediaQueryBreakpoint.Large]: ['(min-width: 992px)', '(max-width: 1199px)'],
  [MediaQueryBreakpoint.ExtraLarge]: ['(min-width: 1200px)']
};

@Injectable()
export class MediaQueryService {

  public readonly breakpoint$ = new BehaviorSubject<MediaQueryBreakpoint>(undefined);

  constructor(
    public breakpointObserver: BreakpointObserver
  ) {
    Object.entries(queries)
      .forEach(([key, value]: [string, string[]]) => this.observe(+key, value));
  }

  public is(condition: (currentBreakpoint: MediaQueryBreakpoint) => boolean): boolean {
    return condition(this.breakpoint$.value);
  }

  private observe(breakpoint: MediaQueryBreakpoint, query: string[]): void {
    this.breakpointObserver
      .observe(query)
      .subscribe((state: BreakpointState) => {
        const { breakpoints } = state;
        const allMatches = Object.keys(breakpoints).every((key: string) => breakpoints[key]);
        if (!allMatches) {
          return;
        }

        this.breakpoint$.next(breakpoint);
      });
  }
}
