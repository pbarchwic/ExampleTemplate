import { Component, Input, Output, EventEmitter } from '@angular/core';

export type AlertType = 'success' | 'info' | 'warning' | 'danger' | 'light';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.scss']
})
export class AlertComponent {
  @Input() hideIcon: boolean;
  @Input() bolded: boolean;
  @Input() type: AlertType;
  @Input() closable = false;
  @Output() closed = new EventEmitter<void>();
}
