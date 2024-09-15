import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceShareRepository } from '@app/core';
import { TrackEventController } from '../../../general';

export interface DeletePermissionComponentData {
  deviceShareId: number;
  onDeleted: () => void;
}

@Component({
  selector: 'app-delete-permission',
  templateUrl: 'delete-permission.component.html',
})
export class DeletePermissionComponent extends TrackEventController {
  public isLoading = false;
  public isError = false;

  constructor(
    private readonly dialogRef: MatDialogRef<DeletePermissionComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: DeletePermissionComponentData,
    private readonly deviceShareRepository: DeviceShareRepository
  ) {
    super();
  }

  public deleteAccess(): void {
    this.isLoading = true;
    this.isError = false;
    this.dialogRef.disableClose = true;

    this.deviceShareRepository.deleteDeviceShare(this.data.deviceShareId).subscribe(
      () => {
        this.data.onDeleted();
        this.close();
      },
      () => {
        this.isError = true;
        this.isLoading = false;
        this.dialogRef.disableClose = false;
      }
    );
  }

  public close(): void {
    this.dialogRef.close();
  }
}
