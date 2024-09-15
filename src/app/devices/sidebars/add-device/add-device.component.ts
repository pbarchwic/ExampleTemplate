import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { SidebarService, FormCheckboxListValue } from '@app/shared';
import { ArrayHelpers, DevicesRepository, UnassignedDevice } from '@app/core';
import { AddDeviceConfirmComponent, AddDeviceConfirmComponentData } from '../../modals';
import { minDevicesValidator } from './validators';

export interface AddDeviceComponentData {
  onAdded: () => void;
}

@Component({
  selector: 'app-add-device',
  templateUrl: 'add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit, OnDestroy {
  public devices: UnassignedDevice[];
  public devicesFiltered: UnassignedDevice[];
  public animationDone = false;
  public isLoading = false;
  public isError = false;
  public isEmpty = false;
  public form: FormGroup;
  @Input() control: FormControl;

  private data: AddDeviceComponentData;
  private subscription = new Subscription();

  constructor(
    private readonly dialog: MatDialog,
    private readonly deviceRepository: DevicesRepository,
    private readonly sidebarService: SidebarService,
    private readonly formBuilder: FormBuilder,
    private readonly translateService: TranslateService
  ) {}

  public get noSearchResults(): boolean {
    const control = this.form.get('devices');
    if (!control) {
      return false;
    }
    return !(control.value as FormCheckboxListValue[]).some((value) => !value.hidden);
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.sidebarService.animationDone.subscribe(() => {
        this.getDevicesList();
        this.animationDone = true;
      })
    );
    this.createForm();
    this.data = this.sidebarService.getData();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public close(): void {
    this.sidebarService.close();
    this.animationDone = false;
  }

  public trackByDeviceId(index: number, device: any): string {
    return device.deviceId;
  }

  public getDevicesList(): void {
    this.isLoading = true;
    this.form.disable();
    this.deviceRepository.getUserDevice().subscribe(
      (response) => {
        this.devices = ArrayHelpers.sortByProperty(response.devices, 'name');
        this.isLoading = false;
        this.form.enable();
        this.isEmpty = !this.devices || this.devices.length === 0;
        if (this.isEmpty) {
          return;
        }

        this.initializeDevices();
        this.subscription.add(this.getDeviceSearchSubscription());
      },
      () => {
        this.isError = true;
        this.isLoading = false;
        this.form.enable();
      }
    );
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      search: [''],
    });
  }

  private initializeDevices(): void {
    const controlArray = this.formBuilder.array(
      this.devices.map((device) => this.createDeviceControl(device)),
      [minDevicesValidator(1)]
    );
    this.form.addControl('devices', controlArray);
  }

  private createDeviceControl(device: UnassignedDevice): FormControl {
    return this.formBuilder.control({
      title: device.name,
      subtitle: this.translateService.instant(`enum_deviceType_${device.type}`),
      checked: false,
      value: device.id,
      originalValue: device,
      hidden: false,
    } as FormCheckboxListValue);
  }

  public addDeviceConfirm(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const selectedDevices = this.getSelectedDevices();
    this.dialog.open(AddDeviceConfirmComponent, {
      width: '555px',
      data: {
        selectedDevices,
        onAdded: () => {
          this.data.onAdded();
          this.close();
        },
      } as AddDeviceConfirmComponentData,
    });
  }

  private getSelectedDevices(): UnassignedDevice[] {
    const values = this.form.get('devices').value as FormCheckboxListValue[];
    return values.filter((value) => value.checked).map((value) => value.originalValue);
  }

  private getDeviceSearchSubscription(): Subscription {
    const devices = this.form.get('devices') as FormArray;
    const devicesControls = devices.controls as FormGroup[];
    return this.form.get('search').valueChanges.subscribe((searchValue: string) => {
      devicesControls.forEach((control) => {
        const controlValue = control.value as FormCheckboxListValue;
        const device = controlValue.originalValue as UnassignedDevice;
        const hidden = searchValue ? !device.name.toLowerCase().includes(searchValue.toLowerCase()) : false;
        control.setValue({
          ...controlValue,
          hidden,
        });
      });
    });
  }
}
