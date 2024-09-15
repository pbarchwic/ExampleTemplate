import { MatIconRegistry } from '@angular/material/icon';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { customIcons } from '../constants';
import { CustomIcon } from '../models';

@Injectable()
export class IconsService {
  public readonly icons: Array<CustomIcon> = customIcons;

  constructor(private readonly matIconRegistry: MatIconRegistry, private readonly domSanitizer: DomSanitizer) {}

  public registerCustomIcons(): void {
    this.icons.forEach((icon) => this.registerIcon(icon));
  }

  private registerIcon({ name, url }: CustomIcon): void {
    this.matIconRegistry.addSvgIcon(name, this.domSanitizer.bypassSecurityTrustResourceUrl(url));
  }
}
