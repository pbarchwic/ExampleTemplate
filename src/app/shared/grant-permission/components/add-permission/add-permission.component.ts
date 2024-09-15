import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of, Subscription, zip, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import {
  PermissionUser,
  PermissionDevice,
  AccessLevel,
  AccessType,
  PermissionDetails,
  UserDevicePermission,
  PermissionsRepository,
  UpdatePermissionCommand,
  CreatePermissionCommand,
  OrganizationContext,
  DevicesRepository,
  AllDevicesResponse,
  UsersRepository,
  AllUsersResponse,
  OrganizationUser,
  AllDevice,
  Device,
  ArrayHelpers,
  DateTimeHelpers,
  DeviceType,
} from '@app/core';

import { FormAutocompleteItem } from '../../../forms';
import { SidebarService } from '../../../sidebar';
import { DeletePermissionComponent } from '../delete-permission/delete-permission.component';
import { timeDetailsValidator, daysDetailsValidator, autocompleteMatch } from '../../validators';
import { AddPermissionMapper, PermissionAutocompleteMapper } from '../../mappers';
import { PermissionFormValue, RefreshPermissionData } from '../../models';
import { TrackEventController } from '../../../general';

export interface AddPermissionComponentData {
  user?: PermissionUser;
  device?: PermissionDevice;
  permission?: UserDevicePermission;
  onUpdated?: (data: RefreshPermissionData) => void;
  onDeleted?: (data: RefreshPermissionData) => void;
}

@Component({
  selector: 'app-add-permission',
  templateUrl: 'add-permission.component.html',
  styleUrls: ['./add-permission.component.scss'],
})
export class AddPermissionComponent extends TrackEventController implements OnInit, OnDestroy {
  private organizationId: number;
  public data: AddPermissionComponentData;
  public user: PermissionUser;
  public device: PermissionDevice;
  public permission: PermissionDetails;
  public mappedPermission: PermissionFormValue;
  public form: FormGroup;
  public isEditMode = false;
  public isLoading = false;
  public isError = false;
  public isCriticalError = false;
  public devicesOptions: FormAutocompleteItem[] = [];
  public usersOptions: FormAutocompleteItem[] = [];
  private subscriptions = new Subscription();

  constructor(
    private readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly sidebarSerivce: SidebarService,
    private readonly permissionsRepository: PermissionsRepository,
    private readonly deviceRepository: DevicesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly organizationContext: OrganizationContext
  ) {
    super();
  }

  public get isNewUser(): boolean {
    const user = this.userControl.value;
    if (!user || typeof user === 'string') {
      return false;
    }

    return !user.id;
  }

  public async ngOnInit(): Promise<void> {
    this.organizationId = this.organizationContext.organization$.value.id;
    this.data = this.sidebarSerivce.getData();
    this.user = this.data.user;
    this.device = this.data.device;

    this.isEditMode = this.data.permission && this.data.permission.accessLevel !== AccessLevel.None;
    this.getDataAndInitialize();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get isCustomAccessType(): boolean {
    return this.form.get('accessDetails.accessType').value === AccessType.Recurring;
  }

  public close(): void {
    this.sidebarSerivce.close();
  }

  public mapNewUser(email: string | FormAutocompleteItem): void {
    if (!email || typeof email !== 'string') {
      return;
    }

    if (Validators.email(this.userControl) !== null) {
      return;
    }

    const user = this.usersOptions.find((userOption) => userOption.helperData === email);
    if (user) {
      this.userControl.setValue(user);
      return;
    }

    this.userControl.setValue({
      name: email,
      helperData: this.translateService.instant('permissions_invite_user'),
      value: email,
    });

    this.isEditMode = false;
    this.permission = undefined;
    this.mappedPermission = undefined;
    this.clearPermissionDetails();
  }

  public async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const command = AddPermissionMapper.mapPermissionToCommand(this.form.value);
    const { user, device } = this.form.value;
    const userEmail = this.user ? this.user.email : user.value;
    const userId = this.user ? this.user.id : user.id;
    const deviceId = this.device ? this.device.id : device.id;
    const deviceShareId = this.permission && this.permission.deviceShareId;

    this.isLoading = true;
    this.form.disable();
    this.isError = false;

    const success = this.isEditMode
      ? await this.permissionsRepository.updatePermission({ id: deviceShareId, ...(command as UpdatePermissionCommand) })
      : await this.permissionsRepository.createPermission({ userEmail, deviceId, ...(command as CreatePermissionCommand) });

    this.isError = !success;
    this.isLoading = false;
    this.form.enable();

    if (this.isError) {
      return;
    }

    if (typeof this.data.onUpdated === 'function') {
      this.data.onUpdated({ userId, deviceId, accessLevel: command.accessLevel, accessType: command.accessType });
    }

    this.close();
  }

  public deleteAccess(): void {
    const { user, device } = this.form.value;
    const userId = this.user ? this.user.id : user.id;
    const deviceId = this.device ? this.device.id : device.id;

    this.dialog.open(DeletePermissionComponent, {
      data: {
        deviceShareId: this.permission.deviceShareId,
        onDeleted: () => {
          if (typeof this.data.onDeleted === 'function') {
            this.data.onDeleted({ userId, deviceId, accessLevel: AccessLevel.None, accessType: AccessType.Permanent });
          }

          this.close();
        },
      },
    });
  }

  public onAutocompleteSelection(type: string): void {
    if (type === 'device') {
      this.toggleRemoteUnlockControl();
    }
    const condition = type === 'user' ? Boolean(this.device || this.deviceControl.value) : Boolean(this.user || this.userControl.value);
    if (condition) {
      this.isLoading = true;
      this.subscriptions.add(
        this.getPermissionObservable().subscribe(
          () => {
            this.isLoading = false;
            this.refreshPermissionDetails();
          },
          () => {
            this.isLoading = false;
            this.isError = !this.permission;
          }
        )
      );
    }
  }

  public dateChange(type: string): void {
    const dateControl =
      type === 'start' ? this.form.get('accessDetails.timeDetails.startDate') : this.form.get('accessDetails.timeDetails.endDate');
    const timeControl =
      type === 'start' ? this.form.get('accessDetails.timeDetails.startTime') : this.form.get('accessDetails.timeDetails.endTime');
    const date = dateControl.value;
    if (timeControl.value) {
      const { hours, minutes } = DateTimeHelpers.splitTime(timeControl.value);
      date.setHours(hours);
      date.setMinutes(minutes);
      dateControl.setValue(date);
    }
  }

  private onTimeChange(): void {
    const controls = [
      { control: this.form.get('accessDetails.timeDetails.startTime'), type: 'start' },
      { control: this.form.get('accessDetails.timeDetails.endTime'), type: 'end' },
    ];
    return controls.forEach((timeControl) => {
      if (!timeControl || !timeControl.control) {
        return;
      }
      this.subscriptions.add(
        timeControl.control.valueChanges.subscribe((value: string) => {
          const dateControl =
            timeControl.type === 'start'
              ? this.form.get('accessDetails.timeDetails.startDate')
              : this.form.get('accessDetails.timeDetails.endDate');
          const date = dateControl && dateControl.value;
          if (date) {
            const { hours, minutes } = DateTimeHelpers.splitTime(value);
            date.setHours(hours);
            date.setMinutes(minutes);
            dateControl.setValue(date);
          }
        })
      );
    });
  }

  private initializeForm(): void {
    this.form = this.createForm();
    const selectedAccessType = this.form.get('accessDetails.accessType').value;
    this.toggleControls(selectedAccessType);
    this.subscriptions.add(this.onChangeAccessType());
    this.toggleRemoteUnlockControl();
  }

  private refreshPermissionDetails(): void {
    if (!this.form || !this.mappedPermission) {
      return;
    }

    const { accessLevel, remoteAccessDisabled, accessType, timeDetails, daysDetails } = this.mappedPermission.accessDetails;
    this.isEditMode = accessLevel !== AccessLevel.None;

    const timeDetailsRequired = accessType === AccessType.Recurring || accessType === AccessType.TimeRestricted;
    timeDetailsRequired ? this.addTimeDetails() : this.removeTimeDetails();

    const daysDetailsRequired = accessType === AccessType.Recurring;
    daysDetailsRequired ? this.addDaysDetails() : this.removeDaysDetails();
    const remoteUnlockNotRequired = this.form.get('device').value && this.form.get('device').value.type === DeviceType.Bridge;
    remoteUnlockNotRequired ? this.removeRemoteUnlock() : this.addRemoteUnlock();

    const value = {
      accessLevel: this.isEditMode ? accessLevel : AccessLevel.Guest,
      accessType: this.isEditMode ? accessType : AccessType.Permanent,
      ...(!remoteUnlockNotRequired ? { remoteAccessDisabled: this.isEditMode ? remoteAccessDisabled : false } : {}),
      ...(timeDetailsRequired ? { timeDetails } : {}),
      ...(daysDetailsRequired ? { daysDetails } : {}),
    };
    this.form.get('accessDetails').setValue(value);
  }

  private createForm(): FormGroup {
    const { mappedPermission } = this;
    return this.formBuilder.group({
      user: [this.user && { id: this.user.id }, [Validators.required, autocompleteMatch]],
      device: [this.device && { id: this.device.id, type: this.device.type }, [Validators.required, autocompleteMatch]],
      accessDetails: this.formBuilder.group({
        accessLevel: [(mappedPermission && mappedPermission.accessDetails.accessLevel) || AccessLevel.Guest, [Validators.required]],
        accessType: [(mappedPermission && mappedPermission.accessDetails.accessType) || AccessType.Permanent, [Validators.required]],
      }),
    });
  }

  private clearPermissionDetails(): void {
    this.form.get('accessDetails').patchValue({
      accessLevel: AccessLevel.Guest,
      remoteAccessDisabled: false,
      accessType: AccessType.Permanent,
    });
  }

  private onChangeAccessType(): Subscription {
    return this.form.get('accessDetails.accessType').valueChanges.subscribe((value: AccessType) => this.toggleControls(value));
  }

  private toggleControls(accessType: AccessType): void {
    const timeDetailsRequired = accessType === AccessType.Recurring || accessType === AccessType.TimeRestricted;
    timeDetailsRequired ? this.addTimeDetails() : this.removeTimeDetails();

    const daysDetailsRequired = accessType === AccessType.Recurring;
    daysDetailsRequired ? this.addDaysDetails() : this.removeDaysDetails();
  }

  private toggleRemoteUnlockControl(): void {
    const remoteUnlockNotRequired = this.form.get('device').value && this.form.get('device').value.type === DeviceType.Bridge;
    remoteUnlockNotRequired ? this.removeRemoteUnlock() : this.addRemoteUnlock();
  }

  private addRemoteUnlock(): void {
    const accessDetailsGroup = this.form.get('accessDetails') as FormGroup;
    const remoteAccessDisabled = this.mappedPermission ? this.mappedPermission.accessDetails.remoteAccessDisabled : false;
    accessDetailsGroup.addControl('remoteAccessDisabled', this.formBuilder.control(remoteAccessDisabled, [Validators.required]));
    this.onTimeChange();
  }

  private removeRemoteUnlock(): void {
    const accessDetails = this.form.get('accessDetails') as FormGroup;
    accessDetails.removeControl('remoteAccessDisabled');
  }

  private addTimeDetails(): void {
    const accessDetailsGroup = this.form.get('accessDetails') as FormGroup;
    const timeDetails = this.mappedPermission && this.mappedPermission.accessDetails.timeDetails;
    const newDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    accessDetailsGroup.addControl(
      'timeDetails',
      this.formBuilder.group(
        {
          startDate: [(timeDetails && timeDetails.startDate) || newDate, [Validators.required]],
          startTime: [(timeDetails && timeDetails.startTime) || DateTimeHelpers.mapDateToTime(newDate), [Validators.required]],
          endDate: [(timeDetails && timeDetails.endDate) || endDate, [Validators.required]],
          endTime: [(timeDetails && timeDetails.endTime) || DateTimeHelpers.mapDateToTime(newDate), [Validators.required]],
        },
        {
          validators: [timeDetailsValidator],
        }
      )
    );
    this.onTimeChange();
  }

  public newDate(): Date {
    return new Date();
  }

  public timeChanged(): void {
    this.form.get('accessDetails.timeDetails.startDate').setValue(this.newDate());
  }

  private removeTimeDetails(): void {
    const accessDetails = this.form.get('accessDetails') as FormGroup;
    accessDetails.removeControl('timeDetails');
  }

  private addDaysDetails(): void {
    const accessDetailsGroup = this.form.get('accessDetails') as FormGroup;
    const daysDetails = this.mappedPermission && this.mappedPermission.accessDetails.daysDetails;
    accessDetailsGroup.addControl(
      'daysDetails',
      this.formBuilder.group(
        {
          days: [(daysDetails && daysDetails.days.length > 0 && daysDetails.days) || [1, 2, 4, 8, 16, 32, 64]],
          dailyStartTime: [daysDetails && daysDetails.dailyStartTime],
          dailyEndTime: [daysDetails && daysDetails.dailyEndTime],
        },
        {
          validators: [daysDetailsValidator],
        }
      )
    );
  }

  private removeDaysDetails(): void {
    const accessDetailsGroup = this.form.get('accessDetails') as FormGroup;
    accessDetailsGroup.removeControl('daysDetails');
  }

  private getDataAndInitialize(): void {
    this.isLoading = true;
    const users$ = this.user ? of(null) : this.getUsersObervable();
    const devices$ = this.device ? of(null) : this.getDevicesObservable();
    const permissions$ = this.isEditMode ? this.getPermissionObservable() : of(null);

    this.subscriptions.add(
      zip(users$, devices$, permissions$).subscribe(
        ([users, devices]: [FormAutocompleteItem[] | null, FormAutocompleteItem[] | null, PermissionFormValue | null]) => {
          this.isLoading = false;
          this.isCriticalError = false;
          this.usersOptions = users;
          this.devicesOptions = devices;
          this.initializeForm();
        },
        () => {
          this.isLoading = false;
          this.isCriticalError = true;
          this.isError = !this.permission;
        }
      )
    );
  }

  private getPermissionObservable(): Observable<PermissionFormValue> {
    const userId = this.user ? this.user.id : this.userControl.value.id;
    const deviceId = this.device ? this.device.id : this.deviceControl.value.id;
    if (!userId || !deviceId) {
      return of(null);
    }

    return this.permissionsRepository.getPermissionDetails(userId, deviceId).pipe(
      map((response: PermissionDetails) => {
        this.permission = response;
        this.mappedPermission = AddPermissionMapper.mapPermissionDetailsToFormValue(response);
        return this.mappedPermission;
      })
    );
  }

  private getDevicesObservable(): Observable<FormAutocompleteItem[]> {
    return this.deviceRepository.getAllDevices({ organizationId: this.organizationId }).pipe(
      map((response: AllDevicesResponse) => response.organizationDevices),
      map((devices: Device<AllDevice>[]) =>
        PermissionAutocompleteMapper.mapDevicesForAutocomplete(ArrayHelpers.sortByProperty(devices, 'name'))
      )
    );
  }

  private getUsersObervable(): Observable<FormAutocompleteItem[]> {
    return this.usersRepository.getAllUsers({ organizationId: this.organizationId }).pipe(
      map((response: AllUsersResponse) => response.organizationUsers),
      map((users: OrganizationUser[]) =>
        PermissionAutocompleteMapper.mapUsersForAutocomplete(ArrayHelpers.filterByProperty(users, 'isOwner', false))
      )
    );
  }

  public get userControl(): AbstractControl {
    return this.form.get('user');
  }

  public get deviceControl(): AbstractControl {
    return this.form.get('device');
  }
}
