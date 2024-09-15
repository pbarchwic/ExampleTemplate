import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrganizationUser, UsersRepository, OrganizationContext } from '@app/core';

export interface DeleteAdministratorComponentData {
  user: OrganizationUser;
  onDeleted: () => void;
}

@Component({
  selector: 'app-delete-administrator',
  templateUrl: 'delete-administrator.component.html',
})
export class DeleteAdministartorComponent implements OnInit {
  public isLoading = false;
  public isError = false;
  public user: OrganizationUser;
  public organizationId: number;

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteAdministartorComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: DeleteAdministratorComponentData,
    private readonly usersRepository: UsersRepository,
    private readonly organizationContext: OrganizationContext
  ) {
    this.organizationId = this.organizationContext.organization$.value.id;
  }

  public ngOnInit(): void {
    this.user = this.data.user;
  }

  public deleteAdministrator(): void {
    this.isLoading = true;
    this.isError = false;
    this.dialogRef.disableClose = true;

    this.usersRepository.removeAdmin({ organizationId: this.organizationId, organizationUserId: this.user.id }).subscribe(
      () => {
        this.data.onDeleted();
        this.isLoading = false;
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
