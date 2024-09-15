import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevicesRepository, Device, AllDevice, Lock, Bridge } from '@app/core';
import { TrackEventController } from '@app/shared';

export interface UnassignDeviceComponentData {
  device: Device<AllDevice | Lock | Bridge>;
  deviceId: number;
  onUnassigned: () => void;
}

@Component({
  selector: 'app-unassign-device',
  templateUrl: 'unassign-device.component.html',
})
export class UnassignDeviceComponent extends TrackEventController implements OnInit {
  public isLoading = false;
  public isError = false;
  public device: Device<AllDevice | Lock | Bridge>;
  public deviceId: number;

  constructor(
    private readonly dialogRef: MatDialogRef<UnassignDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: UnassignDeviceComponentData,
    private readonly devicesRepository: DevicesRepository
  ) {
    super();
  }

  public ngOnInit(): void {
    this.device = this.data.device;
    this.deviceId = this.data.deviceId;
  }

  public unassignDevice(): void {
    this.isLoading = true;
    this.isError = false;
    this.dialogRef.disableClose = true;

    this.devicesRepository.unassignDevice(this.deviceId).subscribe(
      () => {
        this.data.onUnassigned();
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
