import { trigger, state, style, transition, animate } from '@angular/animations';

export const sidenavAnimation = trigger('openClose', [
  state(
    'open',
    style({
      width: '212px',
    })
  ),
  state(
    'closed',
    style({
      width: '56px',
    })
  ),
  transition('open => closed', [animate('0.1s')]),
  transition('closed => open', [animate('0.1s')]),
]);
