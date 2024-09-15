import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AllUsersResponse, ArrayHelpers, OrganizationContext, OrganizationUser, UsersRepository, UserType } from '@app/core';
import { autocompleteMatch, FormAutocompleteItem, PermissionAutocompleteMapper, TrackEventController } from '@app/shared';

@Component({
  selector: 'app-add-administrators',
  templateUrl: 'add-administrators.component.html',
  styleUrls: ['./add-administrator.component.scss'],
})
export class AddAdministratorsComponent extends TrackEventController implements OnInit {
  @Output() addedAdmin = new EventEmitter<FormAutocompleteItem>();
  private organizationId: number;
  public form: FormGroup;
  public usersOptions: FormAutocompleteItem[] = [];
  public isError = false;
  public isLoading = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly usersRepository: UsersRepository,
    private readonly organizationContext: OrganizationContext
  ) {
    super();
    this.organizationId = this.organizationContext.organization$.value.id;
  }

  public ngOnInit(): void {
    this.getDataAndInitialize();
  }

  public async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (!this.form.valid || this.isLoading) {
      return;
    }

    const { user } = this.form.value;
    this.isLoading = true;
    this.userControl.disable();
    this.usersRepository.assignAdmin({ organizationId: this.organizationId, organizationUserId: user.id }).subscribe(
      () => {
        this.isLoading = false;
        this.userControl.enable();
        this.usersOptions = this.usersOptions.filter((userOption) => userOption.id !== user.id);
        this.addedAdmin.emit(user);
        this.form.reset();
      },
      () => {
        this.isError = true;
        this.isLoading = false;
        this.userControl.enable();
      }
    );
  }

  public addDeletedAdminOnList(user: OrganizationUser): void {
    this.usersOptions = [
      ...this.usersOptions,
      {
        id: user.id,
        name: user.displayName,
        helperData: user.email,
      },
    ];
    this.usersOptions = ArrayHelpers.sortByProperty(this.usersOptions, 'name');
  }

  public get isValid(): boolean {
    return this.userControl.value && autocompleteMatch(this.userControl) === null;
  }

  private getDataAndInitialize(): void {
    this.isLoading = true;
    const users$ = this.getUsersObervable();
    users$.subscribe(
      (users: FormAutocompleteItem[]) => {
        this.isLoading = false;
        this.usersOptions = users;
        this.createForm();
      },
      () => {
        this.isError = true;
        this.isLoading = false;
      }
    );
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      user: [''],
    });
  }

  private getUsersObervable(): Observable<FormAutocompleteItem[]> {
    return this.usersRepository.getAllUsers({ organizationId: this.organizationId, userTypes: [UserType.Other] }).pipe(
      map((response: AllUsersResponse) => response.organizationUsers),
      map((users: OrganizationUser[]) =>
        PermissionAutocompleteMapper.mapUsersForAutocomplete(ArrayHelpers.filterByProperty(users, 'isOwner', false))
      )
    );
  }

  private get userControl(): AbstractControl {
    return this.form.get('user');
  }
}
