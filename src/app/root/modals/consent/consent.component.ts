import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConsentComponentData {
  onAccept: () => void;
  onReject: () => void;
}

@Component({
  selector: 'app-consent',
  templateUrl: 'consent.component.html',
  styleUrls: ['./consent.component.scss'],
})
export class ConsentComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: ConsentComponentData,
    private readonly dialogRef: MatDialogRef<ConsentComponent>
  ) {}

  public reject(): void {
    this.dialogRef.close();
    this.data.onReject();
  }

  public accept(): void {
    this.dialogRef.close();
    this.data.onAccept();
  }
}
