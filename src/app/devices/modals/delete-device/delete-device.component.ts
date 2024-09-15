import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevicesRepository, Device, AllDevice, Lock, Bridge } from '@app/core';
import { TrackEventController } from '@app/shared';

export interface DeleteDeviceComponentData {
  device: Device<AllDevice | Lock | Bridge>;
  deviceId: number;
  onDeleted: () => void;
}

@Component({
  selector: 'app-delete-device',
  templateUrl: 'delete-device.component.html',
})
export class DeleteDeviceComponent extends TrackEventController implements OnInit {
  public isLoading = false;
  public isError = false;
  public device: Device<AllDevice | Lock | Bridge>;
  public deviceId: number;

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: DeleteDeviceComponentData,
    private readonly devicesRepository: DevicesRepository
  ) {
    super();
  }

  public ngOnInit(): void {
    this.device = this.data.device;
    this.deviceId = this.data.deviceId;
  }

  public deleteDevice(): void {
    this.isLoading = true;
    this.isError = false;
    this.dialogRef.disableClose = true;

    this.devicesRepository.deleteDevice(this.deviceId).subscribe(
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
