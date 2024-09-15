import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('CoreModule', () => {
  describe('StorageService', () => {
    let testingKey: string;
    let testingValue: string;
    let storageService: StorageService;
    let storage: Storage;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [StorageService],
      });

      storageService = TestBed.inject(StorageService);
      storage = storageService.storage;
      testingKey = `testingKey-${new Date().getTime()}`;
      testingValue = `testingValue-${new Date().getTime()}`;
    });

    it('should create the service', () => {
      expect(storageService).toBeTruthy();
    });

    it('should set item to storage', () => {
      storageService.setItem(testingKey, testingValue);
      const storedValue = storage.getItem(testingKey);
      expect(storedValue).toBe(testingValue);
    });

    it('should get item from storage', () => {
      storage.setItem(testingKey, testingValue);
      const expectedValue = storageService.getItem(testingKey);
      expect(expectedValue).toBe(testingValue);
    });

    it('should remove item from storage', () => {
      storage.setItem(testingKey, testingValue);
      let keyExists = !!storage.getItem(testingKey);
      expect(keyExists).toBeTruthy();
      storageService.removeItem(testingKey);
      keyExists = !!storage.getItem(testingKey);
      expect(keyExists).toBeFalsy();
    });

    it('should clear all data from storage', () => {
      storage.setItem(testingKey, testingValue);
      expect(storage.length).toBeGreaterThan(0);
      storageService.clear();
      expect(storage.length).toBe(0);
    });
  });
});
