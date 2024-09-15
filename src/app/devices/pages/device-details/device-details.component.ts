import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { DeviceContext } from '../../contexts';
import { DeviceDetails, DevicesRepository, DeviceType, UpdateBridgeName, UpdateLockName } from '@app/core';
import { lockStateIcons } from '../devices-locks/devices-status.config';

export interface SoftwareVersions {
  softwareType: number;
  version: string;
  updateAvailable: boolean;
}

@Component({
  selector: 'app-device-details',
  templateUrl: 'device-details.component.html',
  styleUrls: ['./device-details.component.scss'],
})
export class DeviceDetailsComponent implements OnInit {
  public device: DeviceDetails;
  public bridge: DeviceDetails;
  public form: FormGroup;
  public lockStateIcons = lockStateIcons;
  public softwareInfo: SoftwareVersions;
  public deviceType = DeviceType;

  public isUpdate = false;
  public bridgeDetailsLoading = false;
  public isError = false;
  public bridgeDetailsError = false;

  constructor(
    private readonly deviceContext: DeviceContext,
    private readonly formBuilder: FormBuilder,
    private readonly repository: DevicesRepository
  ) {}

  public ngOnInit(): void {
    this.device = this.deviceContext.device$.value;
    this.softwareInfo = this.device.softwareVersions.find((element) => {
      return !element.softwareType && element;
    });
    this.createForm();
    if (this.device.type === DeviceType.Lock && this.device.connectedToId) {
      this.getBridgeDetails(this.device.connectedToId);
    }
  }

  public get nameControl(): AbstractControl {
    return this.form.get('deviceName');
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    this.device.type === DeviceType.Bridge ? this.updateBridge() : this.updateLock();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      deviceName: [this.device.name, [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
    });
  }

  private getBridgeDetails(bridgeId: number): void {
    this.bridgeDetailsLoading = true;
    this.repository.getBridgeDetails(bridgeId).subscribe(
      (bridge: DeviceDetails) => {
        this.bridge = bridge && bridge;
        this.bridgeDetailsLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.bridgeDetailsLoading = false;
        this.bridgeDetailsError = error.status === 404 && true;
      }
    );
  }

  private updateLock(): void {
    const lock: UpdateLockName = {
      id: this.device.id,
      name: this.nameControl.value,
      revision: this.device.revision,
    };
    this.isUpdate = true;
    this.nameControl.disable();
    this.repository.updateLock(lock).subscribe(
      () => {
        this.device.name = this.nameControl.value;
        this.device.revision += 1;
        this.isUpdate = false;
        this.nameControl.enable();
      },
      () => {
        this.isError = true;
        this.isUpdate = false;
        this.nameControl.enable();
      }
    );
  }

  private updateBridge(): void {
    const bridge: UpdateBridgeName = {
      id: this.device.id,
      name: this.nameControl.value,
    };
    this.isUpdate = true;
    this.repository.updateBridge(bridge).subscribe(
      () => {
        this.device.name = this.nameControl.value;
        this.isUpdate = false;
        this.nameControl.enable();
      },
      () => {
        this.isError = true;
        this.isUpdate = false;
        this.nameControl.enable();
      }
    );
  }
}
