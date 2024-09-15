import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  PublicClientApplication,
  AuthenticationResult,
  AccountInfo,
  SilentRequest,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";

import { environment } from "@env/environment";
import { AppInsightsService } from "./app-insights.service";
import { StorageService } from "./storage.service";

const AUTH_VERSION_KEY = "example.auth.version";
const ACCESS_TOKEN_KEY = "example.access_token";
const ACCESS_TOKEN_EXP_KEY = "example.access_token.exp";

@Injectable()
export class AuthService {
  private readonly application: PublicClientApplication;
  private readonly config = environment.auth;
  private readonly signInAuthority: string;
  private readonly passwordResetAuthority: string;

  constructor(
    private readonly router: Router,
    private readonly storageService: StorageService,
    private readonly appInsightsService: AppInsightsService
  ) {
    this.signInAuthority = this.getAuthority(this.config.signInPolicy);
    this.passwordResetAuthority = this.getAuthority(
      this.config.passwordResetPolicy
    );
    this.application = this.getUserAgentApplication(this.signInAuthority);
  }

  public checkIsAuthenticated(): boolean {
    return !!this.getAccount();
  }

  public signIn(): void {
    this.application.loginRedirect({
      scopes: this.config.scopes,
    });
  }

  public resetPassword(): void {
    const application = this.getUserAgentApplication(
      this.passwordResetAuthority
    );
    application.loginRedirect({ scopes: this.config.scopes });
  }

  public signOut(): Promise<void> {
    this.migrateStorageToV2();
    this.appInsightsService.clearUserContext();
    this.storageService.removeItem(ACCESS_TOKEN_EXP_KEY);
    this.storageService.removeItem(ACCESS_TOKEN_KEY);
    return this.application.logout();
  }

  public getToken(): string {
    return this.storageService.getItem(ACCESS_TOKEN_KEY);
  }

  public checkIsInProgress(): boolean {
    const statusKey = `msal.${this.config.clientId}.interaction.status`;
    return this.storageService.getItem(statusKey) === "interaction_in_progress";
  }

  public checkTokenIsExpired(): boolean {
    const expiresOn = this.storageService.getItem(ACCESS_TOKEN_EXP_KEY);
    const exp: number = +expiresOn;
    const now: number = new Date().getTime() / 1000;
    return exp <= now;
  }

  public chceckIsPasswordReset(): boolean {
    const error: string = this.storageService.getItem("msal.login.error");
    return error && error.includes("AADB2C90118") ? true : false;
  }

  public async refreshToken(): Promise<void> {
    const account = this.getAccount();
    if (!account) {
      return this.signIn();
    }

    const request: SilentRequest = {
      scopes: this.config.scopes,
      account,
    };

    try {
      const response = await this.application.acquireTokenSilent(request);
      this.onSuccessAuthentication(response);
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        return await this.application.acquireTokenRedirect(request);
      } else {
        this.signOut();
      }
    }
  }

  private getAccount(): AccountInfo {
    const accounts = this.application.getAllAccounts();
    return accounts && accounts.length ? accounts[0] : undefined;
  }

  private getUserAgentApplication(authority: string): PublicClientApplication {
    const {
      clientId,
      redirectUri,
      postLogoutRedirectUri,
      storeAuthStateInCookie,
      cacheLocation,
    } = this.config;

    const application = new PublicClientApplication({
      auth: {
        authority,
        clientId,
        redirectUri,
        postLogoutRedirectUri,
        knownAuthorities: [authority],
      },
      cache: {
        cacheLocation,
        storeAuthStateInCookie,
      },
    });

    application
      .handleRedirectPromise()
      .then((response) => {
        if (!response) {
          return;
        }

        this.onSuccessAuthentication(response);
        this.router.navigate(["/"]);
      })
      .catch((error) => {
        if (error && error.message && error.message.includes("AADB2C90118")) {
          this.resetPassword();
          return;
        }

        this.signIn();
      });

    return application;
  }

  private onSuccessAuthentication(response: AuthenticationResult): void {
    if (!response || !response.accessToken) {
      return;
    }

    this.storageService.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    this.storageService.setItem(
      ACCESS_TOKEN_EXP_KEY,
      `${response.expiresOn.getTime()}`
    );
  }

  private getAuthority(policy: string): string {
    return `${this.config.authority}/${this.config.tenantId}/${policy}`;
  }

  private migrateStorageToV2(): void {
    const v2 = this.storageService.getItem(AUTH_VERSION_KEY) === "v2";
    if (v2) {
      return;
    }

    this.removeMsalKeysFromStorage();
    this.storageService.setItem(AUTH_VERSION_KEY, "v2");
  }

  private removeMsalKeysFromStorage(): void {
    const keys = Object.keys(this.storageService.storage);
    keys.forEach((key: string) => {
      if (key.toLowerCase().startsWith("msal")) {
        this.storageService.removeItem(key);
      }
    });
  }
}
