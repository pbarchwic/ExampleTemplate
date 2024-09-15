import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';

import {
  PermissionDevice,
  PermissionUser,
  Entity,
  SidenavContext,
  DeviceType,
  UserDevicePermission,
  AccessLevel,
  AccessType,
} from '@app/core';
import {
  RefreshPermissionData,
  SidebarService,
  AddPermissionComponentData,
  AddPermissionComponent,
  TrackEventController,
} from '@app/shared';
import { HorizontalScrollData } from '../../models';
import { MatrixService } from '../../services';
import { matrixVariables } from '../../constants';
import { permissionIconMapper, permissionColorMapper } from '../../mappers';

@Component({
  selector: 'app-permission-matrix',
  templateUrl: 'permission-matrix.component.html',
  styleUrls: ['./permission-matrix.component.scss'],
})
export class PermissionMatrixComponent extends TrackEventController implements OnInit, OnDestroy, AfterViewInit {
  @Input() devices: PermissionDevice[] = [];
  @Input() users: PermissionUser[] = [];
  @Input() deviceType: DeviceType;
  @Output() loadMore = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();
  @ViewChild('matrixContainer') matrixContainer: ElementRef<HTMLDivElement>;

  public hoverUserIndex: number;
  public hoverDeviceIndex: number;
  public transformPx = 0;
  public currentPage = 0;
  public scrollData: HorizontalScrollData = {
    columnWidth: matrixVariables.minWidthOfColumn,
    pages: [],
  };
  private readonly subscriptions = new Subscription();
  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly scrollDispatcher: ScrollDispatcher,
    private readonly sidenavContext: SidenavContext,
    private readonly matrixService: MatrixService,
    private readonly sidebarService: SidebarService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(this.matrixService.refreshPermissionInMatrix$.subscribe((data) => this.updatePermission(data)));
  }

  public ngAfterViewInit(): void {
    if (this.matrixContainer) {
      this.setHorizontalScrollData(this.matrixContainer);
      this.listenToWindowResize();
      this.listenToSidenavChange();
    }
    this.syncScrollables();
  }

  public setHorizontalScrollData({ nativeElement }: ElementRef<HTMLDivElement>): void {
    this.transformPx = 0;
    this.currentPage = 0;
    this.scrollData = this.matrixService.getHorizontalScrollData(nativeElement, this.devices.length);
    this.changeDetectorRef.detectChanges();
  }

  public setHoverIndex(userIndex: number, deviceIndex: number): void {
    this.hoverUserIndex = userIndex;
    this.hoverDeviceIndex = deviceIndex;
  }

  public trackByIdentificator(index: number, item: Entity): number {
    return item.id;
  }

  public scrollMatrix(direction: string): void {
    direction === 'right' ? this.scrollMatrixRight() : this.scrollMatrixLeft();
  }

  public get isOnLastPage(): boolean {
    return this.currentPage === this.scrollData.pages.length - 1;
  }

  public get isOnFirstPage(): boolean {
    return this.currentPage === 0;
  }

  public addPermission(user: PermissionUser, device: PermissionDevice): void {
    if (user.isOwner) {
      return;
    }

    this.sidebarService.open<AddPermissionComponentData>(AddPermissionComponent, {
      user,
      device: { ...device, type: this.deviceType },
      permission: user.devicesPermission.find((item) => item.deviceId === device.id),
      onUpdated: (data: RefreshPermissionData) => this.updatePermission(data),
      onDeleted: () =>
        this.updatePermission({ userId: user.id, deviceId: device.id, accessLevel: AccessLevel.None, accessType: AccessType.None }),
    });
  }

  public get isNavigationVisible(): boolean {
    return this.scrollData.pages.length > 1;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private syncScrollables(): void {
    this.subscriptions.add(
      this.scrollDispatcher.scrolled().subscribe((scrollable: CdkScrollable) => {
        if (scrollable) {
          const left = scrollable.measureScrollOffset('left');
          Array.from(this.scrollDispatcher.scrollContainers.keys())
            .filter((otherScrollable) => otherScrollable && otherScrollable !== scrollable)
            .forEach((otherScrollable) => {
              if (otherScrollable.measureScrollOffset('left') !== left) {
                otherScrollable.scrollTo({ left });
              }
            });
        }
      })
    );
  }

  private updatePermission(data: RefreshPermissionData): void {
    if (!data) {
      return;
    }
    const { userId, deviceId, accessLevel, accessType } = data;
    this.users = this.users.map((user: PermissionUser) => {
      if (user.id !== userId) {
        return user;
      }

      user.devicesPermission = user.devicesPermission.map((permission: UserDevicePermission) => {
        if (permission.deviceId !== deviceId) {
          return permission;
        }

        return { ...permission, accessLevel, accessType };
      });

      user.mappedPermissions[deviceId] = {
        icon: permissionIconMapper(accessLevel),
        color: permissionColorMapper(accessType),
        accessLevel,
        accessType
      };
      return user;
    });
  }

  private scrollMatrixLeft(): void {
    if (this.isOnFirstPage) {
      return;
    }

    this.transformPx -= this.scrollData.pages[this.currentPage];
    this.currentPage--;
  }

  private scrollMatrixRight(): void {
    if (this.isOnLastPage) {
      return;
    }

    this.currentPage++;
    this.transformPx += this.scrollData.pages[this.currentPage];
  }

  private listenToWindowResize(): void {
    this.subscriptions.add(
      fromEvent(window, 'resize')
        .pipe(throttleTime(50))
        .subscribe(() => {
          if (this.matrixContainer) {
            this.setHorizontalScrollData(this.matrixContainer);
          }
        })
    );
  }

  private listenToSidenavChange(): void {
    this.subscriptions.add(this.sidenavContext.sidenavToggle$.subscribe(() => this.setHorizontalScrollData(this.matrixContainer)));
  }
}
