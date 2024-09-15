import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

import { SidebarService } from '@app/shared';
import {
  PermissionDevice,
  PermissionUser,
  PermissionsRepository,
  AccessLevel,
  AccessType,
  DevicesRepository,
  UsersRepository,
  Organization,
  OrganizationContext,
} from '@app/core';
import { AddPermissionComponent } from './add-permission.component';

class SidebarServiceStub {
  public getData(): object {
    return {
      user: {
        id: 1,
        devicesPermission: [],
      } as PermissionUser,
      device: {
        id: 123,
      } as PermissionDevice,
      permission: {
        deviceId: 1,
        accessLevel: AccessLevel.Admin,
        accessType: AccessType.Permanent,
      },
    };
  }
  public close(): void {}
}

class OrganizationContextStub {
  public organization$: BehaviorSubject<Organization> = new BehaviorSubject<Organization>({
    id: 0,
    name: '',
    slug: '',
    color: '',
    initials: '',
    logo: '',
    ownerName: '',
    bridgesCount: 0,
    locksCount: 0,
    description: ''
  });
}

describe('PermissionsModule', () => {
  describe('AddPermissionComponent', () => {
    let component: AddPermissionComponent;
    let sidebarService: SidebarService;
    let fixture: ComponentFixture<AddPermissionComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), MatDialogModule, HttpClientModule],
        declarations: [AddPermissionComponent],
        providers: [
          FormBuilder,
          { provide: SidebarService, useClass: SidebarServiceStub },
          { provide: OrganizationContext, useClass: OrganizationContextStub },
          PermissionsRepository,
          DevicesRepository,
          UsersRepository,
        ],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AddPermissionComponent);
      component = fixture.componentInstance;
      sidebarService = TestBed.inject(SidebarService);
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });
});
