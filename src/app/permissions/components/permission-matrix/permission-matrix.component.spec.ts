import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { SidebarService } from '@app/shared';
import { Entity, PermissionDevice, SidenavContext, PermissionUser } from '@app/core';
import { PermissionMatrixComponent } from './permission-matrix.component';
import { MatrixService } from '../../services';
import { HorizontalScrollData } from '../../models';

class MatrixServiceStub {
  public refreshPermissionInMatrix$ = of({});
  public getHorizontalScrollData(): HorizontalScrollData {
    return {
      columnWidth: 112,
      pages: [1008, 1008, 448],
    };
  }
}
class SidenavContextStub {
  public readonly sidenavToggle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
}

class SidebarServiceStub {
  public open(): void {}
}

describe('PermissionsModule', () => {
  describe('PermissionMatrixComponent', () => {
    let component: PermissionMatrixComponent;
    let matrixService: MatrixService;
    let sidebarService: SidebarService;
    let fixture: ComponentFixture<PermissionMatrixComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [PermissionMatrixComponent],
        providers: [
          { provide: MatrixService, useClass: MatrixServiceStub },
          { provide: SidenavContext, useClass: SidenavContextStub },
          { provide: SidebarService, useClass: SidebarServiceStub },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(PermissionMatrixComponent);
      component = fixture.componentInstance;
      matrixService = TestBed.inject(MatrixService);
      sidebarService = TestBed.inject(SidebarService);
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should set correct index on hover', () => {
      component.setHoverIndex(66, 99);
      expect(component.hoverUserIndex).toEqual(66);
      expect(component.hoverDeviceIndex).toEqual(99);
    });

    describe('#ngAfterViewInit', () => {
      it('should start to listen to window resize and set hotizontal scroll, if matrix container exists', () => {
        const listenToWindowResizeSpy = spyOn(component as any, 'listenToWindowResize');
        const setHorizontalScrollDataSpy = spyOn(component as any, 'setHorizontalScrollData');
        const listenToSidenavChangeSpy = spyOn(component as any, 'listenToSidenavChange');
        component.matrixContainer = {} as ElementRef<HTMLDivElement>;
        component.ngAfterViewInit();
        expect(listenToWindowResizeSpy).toHaveBeenCalled();
        expect(setHorizontalScrollDataSpy).toHaveBeenCalled();
        expect(listenToSidenavChangeSpy).toHaveBeenCalled();
      });

      it('should not start to listen to window resize and set hotizontal scroll, if matrix container does not exist', () => {
        const listenToWindowResizeSpy = spyOn(component as any, 'listenToWindowResize');
        const setHorizontalScrollDataSpy = spyOn(component as any, 'setHorizontalScrollData');
        const listenToSidenavChangeSpy = spyOn(component as any, 'listenToSidenavChange');
        component.matrixContainer = undefined;
        component.ngAfterViewInit();
        expect(listenToWindowResizeSpy).not.toHaveBeenCalled();
        expect(setHorizontalScrollDataSpy).not.toHaveBeenCalled();
        expect(listenToSidenavChangeSpy).not.toHaveBeenCalled();
      });
    });

    it('should return item id for track by', () => {
      const result = component.trackByIdentificator(1, { id: 1 } as Entity);
      expect(result).toEqual(1);
    });

    describe('#isOnFirstPage', () => {
      it('should return true, if first page currently opened', () => {
        component.currentPage = 0;
        const result = component.isOnFirstPage;
        expect(result).toBeTruthy();
      });
      it('should return false, if not first page currently opened', () => {
        component.currentPage = 2;
        const result = component.isOnFirstPage;
        expect(result).toBeFalsy();
      });
    });

    describe('#isOnLastPage', () => {
      it('should return true, if last page currently opened', () => {
        component.scrollData.pages = [100, 100, 100];
        component.currentPage = 2;
        const result = component.isOnLastPage;
        expect(result).toBeTruthy();
      });
      it('should return false, if not last page currently opened', () => {
        component.scrollData.pages = [100, 100, 100];
        component.currentPage = 1;
        const result = component.isOnLastPage;
        expect(result).toBeFalsy();
      });
    });

    describe('#scrollMatrix', () => {
      it('should scroll matrix to right', () => {
        const spy = spyOn(component as any, 'scrollMatrixRight');
        component.scrollMatrix('right');
        expect(spy).toHaveBeenCalledTimes(1);
      });
      it('should scroll matrix to left', () => {
        const spy = spyOn(component as any, 'scrollMatrixLeft');
        component.scrollMatrix('left');
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('#scrollMatrixLeft', () => {
      it('should scroll to left, if not on first page', () => {
        component.currentPage = 1;
        component.transformPx = 200;
        component.scrollData.pages = [200, 100];
        (component as any).scrollMatrixLeft();
        expect(component.transformPx).toEqual(100);
        expect(component.currentPage).toEqual(0);
      });
      it('should not scroll to left, if on first page', () => {
        component.currentPage = 0;
        component.transformPx = 200;
        component.scrollData.pages = [200, 100];
        (component as any).scrollMatrixLeft();
        expect(component.transformPx).toEqual(200);
        expect(component.currentPage).toEqual(0);
      });
    });

    describe('#scrollMatrixRight', () => {
      it('should scroll to right, if not on last page', () => {
        component.currentPage = 0;
        component.transformPx = 200;
        component.scrollData.pages = [200, 100];
        (component as any).scrollMatrixRight();
        expect(component.transformPx).toEqual(300);
        expect(component.currentPage).toEqual(1);
      });
      it('should not scroll to right, if on last page', () => {
        component.currentPage = 1;
        component.transformPx = 300;
        component.scrollData.pages = [200, 100];
        (component as any).scrollMatrixRight();
        expect(component.transformPx).toEqual(300);
        expect(component.currentPage).toEqual(1);
      });
    });

    describe('#isNavigationVisible', () => {
      it('should return true, if there are more pages to scroll to', () => {
        component.scrollData.pages = [100, 100, 100];
        const result = component.isNavigationVisible;
        expect(result).toBeTruthy();
      });
      it('should return false, if there are no other pages', () => {
        component.scrollData.pages = [100];
        const result = component.isNavigationVisible;
        expect(result).toBeFalsy();
      });
    });

    describe('#setHorizontalScrollData', () => {
      it('should call service and reset transform and current page', () => {
        component.transformPx = 100;
        component.currentPage = 2;
        component.scrollData = null;
        component.devices = [{} as PermissionDevice, {} as PermissionDevice];
        const spy = spyOn(matrixService, 'getHorizontalScrollData').and.returnValue({
          columnWidth: 112,
          pages: [1008, 1008, 448],
        });
        const element = { nativeElement: {} as HTMLDivElement } as ElementRef<HTMLDivElement>;
        component.setHorizontalScrollData(element);
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledWith(element.nativeElement, 2);
        expect(component.transformPx).toEqual(0);
        expect(component.currentPage).toEqual(0);
      });
    });

    describe('#addPermission', () => {
      // it('should call open sidebar in sidenav service with correct params if user is not owner', () => {
      //   const spy = spyOn(sidebarService, 'open');
      //   const user = { displayName: 'Test User', isOwner: false } as PermissionUser;
      //   const device = { name: 'Test Device' } as PermissionDevice;
      //   component.deviceType = 1;
      //   component.users = [],
      //   component.addPermission(user, device);
      //   expect(spy).toHaveBeenCalledWith(AddPermissionComponent, {
      //     user,
      //     device: { name: 'Test Device', type: 1 },
      //     permission: {},
      //     onUpdated: jasmine.any(Function),
      //     onDeleted: jasmine.any(Function)
      //   });
      // });

      it('should not open sidebar in sidenav service if user is organization owner', () => {
        const spy = spyOn(sidebarService, 'open');
        const user = { displayName: 'Test User', isOwner: true } as PermissionUser;
        const device = { name: 'Test Device' } as PermissionDevice;
        component.deviceType = 1;
        component.addPermission(user, device);
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
