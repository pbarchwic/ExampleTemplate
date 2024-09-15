import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { OrganizationContext, OrganizationUser, UsersRepository } from '@app/core';
import { SidebarService, TrackEventController } from '@app/shared';
import { DeleteUserComponent, DeleteUserComponentData } from '@app/users/modals';

export interface AddUserComponentData {
  user?: OrganizationUser;
  onAdded?: () => void;
  onEdited?: (displayName: string) => void;
  onDeleted?: () => void;
}

export interface UserFormValue {
  name: string;
  email: string;
}
@Component({
  selector: 'app-add-user',
  templateUrl: 'add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent extends TrackEventController implements OnInit {
  public organizationId: number;
  public form: FormGroup;
  public data: AddUserComponentData;
  public user: OrganizationUser;
  public editMode: boolean;
  public isLoading = false;
  public isError = false;
  public error: number;

  constructor(
    private readonly dialog: MatDialog,
    private readonly usersRepository: UsersRepository,
    private readonly sidebarService: SidebarService,
    private readonly formBuilder: FormBuilder,
    private readonly organizationContext: OrganizationContext
  ) {
    super();
  }

  public ngOnInit(): void {
    this.organizationId = this.organizationContext.organization$.value.id;
    this.createForm();
    this.data = this.sidebarService.getData();
    this.user = this.data.user;
    this.editMode = !!this.user;

    if (this.editMode) {
      this.form.setValue(this.getInitialValue(this.user));
      this.form.get('email').disable();
    }
  }

  public close(): void {
    this.sidebarService.close();
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const value = this.form.value;

    this.editMode ? this.updateUser(value) : this.addUser(value);
  }

  public deleteUser(): void {
    this.dialog.open(DeleteUserComponent, {
      data: {
        user: this.user,
        onDeleted: () => {
          this.data.onDeleted();
          this.close();
        },
      } as DeleteUserComponentData,
    });
  }

  private addUser(value: UserFormValue): void {
    this.isLoading = true;
    this.isError = false;
    this.form.disable();

    this.usersRepository.addUser({ ...value, organizationId: this.organizationId }).subscribe(
      () => {
        this.data.onAdded();
        this.close();
        this.isLoading = false;
      },
      (error: Error) => {
        this.error = error instanceof HttpErrorResponse && error.status;
        this.isError = true;
        this.isLoading = false;
        this.form.enable();
      }
    );
  }

  private updateUser(value: UserFormValue): void {
    this.isLoading = true;
    this.isError = false;
    this.form.disable();
    const updateUser = {
      displayName: value.name,
      organizationId: this.organizationId,
      organizationUserId: this.user.id,
    };
    this.usersRepository.updateUser(updateUser).subscribe(
      () => {
        this.data.onEdited(value.name);
        this.user = this.data.user;
        this.close();
        this.isLoading = false;
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
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
    });
  }

  private getInitialValue(user: OrganizationUser): UserFormValue {
    const value = {
      name: user.displayName,
      email: user.email,
    };
    return value;
  }
}
