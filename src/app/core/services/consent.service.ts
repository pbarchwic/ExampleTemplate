import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { ConsentComponent, ConsentComponentData } from "@app/root/modals";
import { AuthService } from "./auth.service";
import { StorageService } from "./storage.service";

@Injectable()
export class ConsentService {
  constructor(
    private readonly dialog: MatDialog,
    private readonly storageService: StorageService,
    private readonly authService: AuthService
  ) {}

  public showUserConsent(): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialog.open(ConsentComponent, {
        width: "471px",
        closeOnNavigation: false,
        disableClose: true,
        data: {
          onAccept: () => {
            this.storageService.setItem("example.consent", "accepted");
            resolve(true);
          },
          onReject: () => {
            this.authService.signOut();
            this.storageService.setItem("example.consent", "rejected");
            resolve(false);
          },
        } as ConsentComponentData,
      });
    });
  }
}
