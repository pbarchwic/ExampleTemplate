import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { throttleTime } from 'rxjs/operators';

import { OrganizationContext, OrganizationUser, SidenavContext, UserContext, UsersRepository } from '@app/core';
import { AddPermissionComponent, AddPermissionComponentData, SidebarService, SlugUrlPipe } from '@app/shared';
import { DeleteUserComponent, DeleteUserComponentData } from '../../modals';
import { UsersService } from '../../services';
import { AddUserComponent, AddUserComponentData } from '../../sidebars';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [ SlugUrlPipe ]
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('userRoleTd') userRolesTds: QueryList<ElementRef<HTMLTableCellElement>>;
  public organizationId: number;
  public users: OrganizationUser[] = [];
  public currentPage = 0;
  public itemsPerPage = 25;
  public isLastPage: boolean;

  public isLoading = false;
  public isError = false;

  public contextEditMenu = [
    {
      label: 'edit',
      action: 'edit',
      theme: 'default',
    },
  ];

  public contextMenu = [
    {
      label: 'details',
      action: 'details',
      theme: 'default',
    },
    {
      label: 'assign_permission',
      action: 'assignPermissions',
      theme: 'default',
    },
    ...this.contextEditMenu,
    {
      label: 'delete',
      action: 'delete',
      theme: 'danger',
    },
  ];

  private subscriptions = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly usersRepository: UsersRepository,
    private readonly sidebarService: SidebarService,
    private readonly organizationContext: OrganizationContext,
    private readonly usersService: UsersService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly sidenavContext: SidenavContext,
    private readonly slugUrlPipe: SlugUrlPipe,
    private readonly userContext: UserContext
  ) {}

  public ngOnInit(): void {
    this.organizationId = this.organizationContext.organization$.value.id;
    this.getUsers();
    this.subscriptions.add(this.getRefreshListSubscription());
  }

  public ngAfterViewInit(): void {
    this.calculateVisibleUserRoles();
    this.listenToWindowResize();
    this.listenToSidenavChange();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public refreshUsers(): void {
    this.users = [];
    this.currentPage = 0;
    this.isLastPage = false;
    this.getUsers();
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

  public contextMenuAction(action: string, user: OrganizationUser): void {
    switch (action) {
      case 'details':
        this.router.navigateByUrl(this.slugUrlPipe.transform(`/users/${user.id}`));
        break;
      case 'assignPermissions':
        this.assignPermissions(user);
        break;
      case 'edit':
        this.editUser(user);
        break;
      case 'delete':
        this.deleteUser(user);
        break;
    }
  }

  private deleteUser(user: OrganizationUser): void {
    this.dialog.open(DeleteUserComponent, {
      data: {
        user,
        onDeleted: () => this.onDeletedUser(user),
      } as DeleteUserComponentData,
    });
  }

  private editUser(user: OrganizationUser): void {
    this.sidebarService.open<AddUserComponentData>(AddUserComponent, {
      user,
      onEdited: (displayName) =>
        this.users.map((editUser) => {
          if (editUser.id === user.id) {
            user.displayName = displayName;
          }
        }),
      onDeleted: () => this.onDeletedUser(user),
    });
  }

  private assignPermissions(user: OrganizationUser): void {
    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, {
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        devicesPermission: undefined,
        isOwner: undefined,
      },
    });
  }

  private onDeletedUser(user: OrganizationUser): void {
    if (user.email === this.userContext.user$.getValue().email) {
      this.router.navigate(['/']);
    }
    this.users = this.users.filter((item) => item.id !== user.id);
    if (this.users.length < 3 && !this.isLastPage) {
      this.refreshUsers();
    }
  }

  private getRefreshListSubscription(): Subscription {
    return this.usersService.refreshUsers$.subscribe(() => this.refreshUsers());
  }

  private calculateVisibleUserRoles(): void {
    this.subscriptions.add(this.userRolesTds.changes.subscribe(() => this.mapTableCells()));
  }

  private listenToWindowResize(): void {
    this.subscriptions.add(
      fromEvent(window, 'resize')
        .pipe(throttleTime(50))
        .subscribe(() => this.mapTableCells())
    );
  }
  private listenToSidenavChange(): void {
    this.subscriptions.add(this.sidenavContext.sidenavToggle$.subscribe(() => this.mapTableCells()));
  }

  private mapTableCells(): void {
    this.userRolesTds.map(({ nativeElement }, index) => {
      const avaliableSpace = nativeElement.clientWidth - 50; // Width of table cell - 50px for counter
      const tdChildren = Array.from(nativeElement.children);
      const rolesWrapper = tdChildren ? tdChildren.find((el) => el.className === 'user__role-wrapper') : null;
      const rolesElements = rolesWrapper ? Array.from(rolesWrapper.children) : [];
      const currentUser = this.users[index];
      if (currentUser) {
        currentUser.hiddenRoles = this.mapRolesElements(rolesElements, avaliableSpace);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private mapRolesElements(rolesElements: Array<Element>, avaliableSpace: number): Array<string> {
    const hiddenRoles = [];
    let childrenSpace = 0;

    rolesElements.forEach((element: HTMLSpanElement) => {
      element.classList.remove('d-none');
      childrenSpace += element.offsetWidth + 8; // Element width + plus right margin
      if (childrenSpace > avaliableSpace) {
        element.classList.add('d-none');
        hiddenRoles.push(element.innerText.trim());
      }
    });
    return hiddenRoles;
  }
}
