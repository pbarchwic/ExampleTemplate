import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';
import { SidebarContent } from '../models';
import { Type } from '@angular/core';

describe('CoreModule', () => {
  describe('SidebarService', () => {
    let service: SidebarService;
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [SidebarService],
      });

      service = TestBed.inject(SidebarService);
    });

    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should return sidebar content as an observable', () => {
      const sidebarContent = new SidebarContent({} as Type<any>, { test: 'test' });
      service.content.next(sidebarContent);
      expect(service.content.value).toBe(sidebarContent);
    });

    it('should open sidebar with new content', () => {
      const spy = spyOn(service.content, 'next');
      service.open({} as Type<any>, { test: 'test' });
      expect(spy).toHaveBeenCalledWith(new SidebarContent({} as Type<any>, { test: 'test' }));
    });

    it('should not send any content if sidebar is closed', () => {
      const spyContent = spyOn<any>(service.content, 'next');
      const spyOpenedChange = spyOn(service.openedChange, 'emit');
      service.close();

      expect(spyContent).toHaveBeenCalledWith(undefined);
      expect(spyOpenedChange).toHaveBeenCalledWith(false);
    });
  });
});
