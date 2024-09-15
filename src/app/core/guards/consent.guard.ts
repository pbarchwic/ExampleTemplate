import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

import { AuthService, StorageService, ConsentService } from "../services";

@Injectable()
export class ConsentGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
    private readonly consentService: ConsentService
  ) {}

  public canActivate(): Promise<boolean> | boolean {
    return this.check();
  }

  private check(): Promise<boolean> | boolean {
    if (!this.authService.getToken()) {
      return false;
    }

    const consent: string = this.storageService.getItem("example.consent");
    if (consent !== "accepted") {
      return this.consentService.showUserConsent();
    }
    return true;
  }
}
