import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { environment } from '@env/environment';
import { ApiInterceptor } from './api.interceptor';

describe('RootModule', () => {
  describe('ApiInterceptor', () => {
    let httpMock: HttpTestingController;
    let client: HttpClient;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule
        ],
        providers: [
          ApiInterceptor
        ]
      });

      client = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    it(`should add an api url to the api request`, () => {
      const endpoint = '/api/test';
      client.get(endpoint).subscribe();
      const requests = httpMock.match({ method: 'get' });
      expect(requests[0].request.url).toBe(environment.api.url + endpoint);
    });

    it(`should not add an api url to the local request`, () => {
      const endpoint = '/assets/translations/en.json';
      client.get(endpoint).subscribe();
      const requests = httpMock.match({ method: 'get' });
      expect(requests[0].request.url).toBe(endpoint);
    });
  });
});
