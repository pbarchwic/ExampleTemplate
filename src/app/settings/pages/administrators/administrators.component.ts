import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormAutocompleteItem } from '@app/shared';
import { MatDialog } from '@angular/material/dialog';

import { ArrayHelpers, OrganizationContext, OrganizationUser, UserContext, UsersRepository, UserType } from '@app/core';
import { AddAdministratorsComponent } from '../../components';
import { DeleteAdministartorComponent, DeleteAdministratorComponentData } from '../../modals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrators',
  templateUrl: 'administrators.component.html',
  styleUrls: ['./administrators.component.scss'],
})
export class AdministratorsComponent implements OnInit, OnDestroy {
  @ViewChild(AddAdministratorsComponent) addAdministartorsComponent: AddAdministratorsComponent;
  public organizationId: number;
  public users: OrganizationUser[] = [];
  public currentPage = 0;
  public itemsPerPage = 25;
  public isLastPage: boolean;
  public isLoading = false;
  public isError = false;

  public contextMenu = [
    {
      label: 'delete',
      action: 'delete',
      theme: 'danger',
    },
  ];

  private subscriptions = new Subscription();

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly organizationContext: OrganizationContext,
    private readonly dialog: MatDialog,
    private readonly userContext: UserContext,
    private readonly router: Router,
  ) {
    this.organizationId = this.organizationContext.organization$.value.id;
  }

  public ngOnInit(): void {
    this.getUsers();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public contextMenuAction(action: string, user: OrganizationUser): void {
    switch (action) {
      case 'delete':
        this.deleteAdmin(user);
        break;
    }
  }

  public addNewAdmin(newAdmin: FormAutocompleteItem): void {
    this.users.push({
      displayName: newAdmin.name,
      email: newAdmin.helperData,
      id: newAdmin.id,
      isOwner: false,
    });
    this.users = ArrayHelpers.sortByProperty(this.users, 'displayName');
    this.isLoading = false;
  }

  private deleteAdmin(user: OrganizationUser): void {
    this.dialog.open(DeleteAdministartorComponent, {
      data: {
        user,
        onDeleted: () => this.onDeletedAdministarator(user),
      } as DeleteAdministratorComponentData,
    });
  }

  private onDeletedAdministarator(user: OrganizationUser): void {
    if (user.email === this.userContext.user$.getValue().email) {
      this.router.navigate(['/']);
    }
    this.users = this.users.filter((admin) => admin.id !== user.id);
    this.addAdministartorsComponent.addDeletedAdminOnList(user);
  }

  public getUsers(): void {
    if (this.isLoading || this.isLastPage) {
      return;
    }

    this.currentPage += 1;
    this.isLoading = true;
    this.usersRepository
      .getAllUsers({
        organizationId: this.organizationId,
        page: this.currentPage,
        itemsPerPage: this.itemsPerPage,
        userTypes: [UserType.Admin],
      })
      .subscribe(
        (users) => {
          this.isLastPage = this.currentPage > 1 && users.organizationUsers.length < this.itemsPerPage;
          this.users = [...this.users, ...users.organizationUsers];
          this.isLoading = false;
        },
        () => {
          this.isError = true;
          this.isLoading = false;
        }
      );
  }
}
