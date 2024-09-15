import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, from, EMPTY } from 'rxjs';
import { filter, take, switchMap, catchError } from 'rxjs/operators';

import { AuthService } from '@app/core';

enum RefreshTokenStatus {
  None = 0,
  Pending = 1,
  Refreshed = 2
}

@Injectable()
class Interceptor implements HttpInterceptor {
  private readonly refreshTokenStatus$ = new BehaviorSubject<RefreshTokenStatus>(RefreshTokenStatus.None);

  constructor(
    private readonly authService: AuthService
  ) {

  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.checkTokenIsExpired()) {
      return this.onTokenExpired(req, next);
    }

    return this.handleRequest(req, next);
  }

  private onTokenExpired(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.refreshTokenStatus$.value === RefreshTokenStatus.Pending) {
        return this.storeRequest(req, next);
    }

    this.refreshTokenStatus$.next(RefreshTokenStatus.Pending);
    return this.refreshToken(req, next);
  }

  private storeRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.refreshTokenStatus$).pipe(
      filter(status => status === RefreshTokenStatus.Refreshed),
      take(1),
      switchMap(() => this.handleRequest(req, next))
    );
  }

  private refreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.refreshToken()).pipe(
      catchError(() => {
        this.authService.signOut();
        return EMPTY;
      }),
      switchMap(() => {
        this.refreshTokenStatus$.next(RefreshTokenStatus.Refreshed);
        return next.handle(this.cloneRequest(req)).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.authService.signOut();
              return EMPTY;
            }

            throw error;
          })
        );
      })
    );
  }

  private handleRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.cloneRequest(req)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.refreshToken(req, next);
        }

        throw error;
      })
    );
  }

  private cloneRequest(req: HttpRequest<any>): HttpRequest<any> {
    const headers = {
      Authorization: `Bearer ${this.authService.getToken()}`
    };

    return req.clone({
      setHeaders: headers
    });
  }
}

export const TokenInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: Interceptor,
  multi: true
};
