import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as user from '@assets/mocks/user.json';
import { User } from '../models';
import { UserRepository } from './user.repository';

describe('CoreModule', () => {
  describe('UserRepository', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let userRepository: UserRepository;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [UserRepository]
      });

      httpClient = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
      userRepository = TestBed.inject(UserRepository);
    });

    describe('Get user profile', () => {
      it('should return expected user profile', () => {
        userRepository
          .getProfile()
          .subscribe((response: User) =>
            expect(response).toEqual(user.result));

        const req = httpMock.expectOne(`/my/user`);
        expect(req.request.method).toBe('GET');

        req.flush({ result: user.result });
        httpMock.verify();
      });

      it('should catch expected error', () => {
        userRepository
          .getProfile()
          .subscribe(
            () => fail('Expected an error, not user profile.'),
            (error: HttpErrorResponse) => expect(error.status).toBe(404)
          );

        const req = httpMock.expectOne(`/my/user`);
        expect(req.request.method).toBe('GET');

        req.error(new ErrorEvent('NOT_FOUND'), { status: 404 });
        httpMock.verify();
      });
    });
  });
});
