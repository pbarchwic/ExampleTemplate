import { trigger, state, style, transition, animate } from '@angular/animations';

export const sidebarAnimation = trigger('openSidebar', [
  state(
    'open',
    style({
      right: 0,
    })
  ),
  transition('* => open', [animate('0.4s')]),
]);
