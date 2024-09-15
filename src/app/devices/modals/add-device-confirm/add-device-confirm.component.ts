import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { DevicesRepository, OrganizationContext, UnassignedDevice } from '@app/core';
import { TrackEventController } from '@app/shared';

export interface AddDeviceConfirmComponentData {
  selectedDevices: UnassignedDevice[];
  onAdded: () => void;
}

@Component({
  selector: 'app-add-device-confirm',
  templateUrl: 'add-device-confirm.component.html',
  styleUrls: ['add-device-confirm.component.scss'],
})
export class AddDeviceConfirmComponent extends TrackEventController {
  public isLoading = false;
  public isError = false;
  public form: FormGroup = this.createForm();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddDeviceConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: AddDeviceConfirmComponentData,
    private readonly translateService: TranslateService,
    private readonly devicesRepository: DevicesRepository,
    private readonly organizationContext: OrganizationContext
  ) {
    super();
  }

  public confirm(): void {
    this.isLoading = true;
    this.form.disable();
    this.isError = false;
    this.dialogRef.disableClose = true;
    const organizationId = this.organizationContext.organization$.value.id;
    const devicesIds = this.data.selectedDevices.map((devices) => devices.id);
    const assignUsers = this.form.get('assignUsers').value.checked;
    this.devicesRepository.addDevices({ organizationId, devicesIds, assignUsers }).subscribe(
      () => {
        this.data.onAdded();
        this.close();
      },
      () => {
        this.isError = true;
        this.isLoading = false;
        this.form.enable();
        this.dialogRef.disableClose = false;
      }
    );
  }

  public close(): void {
    this.dialogRef.close();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      assignUsers: [
        {
          title: this.translateService.instant('add_device_assign_users'),
          checked: true,
        },
      ],
    });
  }
}
