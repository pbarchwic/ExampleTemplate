import { Component, Input } from '@angular/core';
import { stylesVariables } from '../../constants';

export const avatarComponentDefaults = {
  initials: '-',
  color: stylesVariables.colorPrimary,
  width: 32,
  height: 32,
  radius: 50,
  image: undefined,
};

@Component({
  selector: 'app-avatar',
  templateUrl: 'avatar.component.html',
  styleUrls: ['avatar.component.scss'],
})
export class AvatarComponent {
  @Input() initials: string = avatarComponentDefaults.initials;
  @Input() color: string = avatarComponentDefaults.color;
  @Input() width: number = avatarComponentDefaults.width;
  @Input() height: number = avatarComponentDefaults.height;
  @Input() radius: number = avatarComponentDefaults.radius;
  @Input() image: string;
  public readonly defaults = avatarComponentDefaults;
}
