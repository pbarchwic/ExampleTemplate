import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersRepository, OrganizationUser } from '@app/core';
import { TrackEventController } from '@app/shared';

export interface DeleteUserComponentData {
  user: OrganizationUser;
  onDeleted: () => void;
}

@Component({
  selector: 'app-delete-user',
  templateUrl: 'delete-user.component.html',
})
export class DeleteUserComponent extends TrackEventController implements OnInit {
  public isLoading = false;
  public isError = false;
  public user: OrganizationUser;
  public userId: number;

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: DeleteUserComponentData,
    private readonly usersRepository: UsersRepository
  ) {
    super();
  }

  public ngOnInit(): void {
    this.user = this.data.user;
    this.userId = this.user.id;
  }

  public deleteUser(): void {
    this.isLoading = true;
    this.isError = false;
    this.dialogRef.disableClose = true;

    this.usersRepository.deleteUser(this.userId).subscribe(
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
