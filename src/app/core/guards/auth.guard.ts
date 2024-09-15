import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService
  ) { }

  public canActivate(): Promise<boolean> | boolean {
    return this.check();
  }

  private async check(): Promise<boolean> {
    if (this.authService.checkIsInProgress()) {
      return false;
    }

    if (!this.authService.getToken()) {
      await this.authService.refreshToken();
    }

    return true;
  }
}
