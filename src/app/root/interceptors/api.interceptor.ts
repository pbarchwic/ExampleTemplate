import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS, HttpClient, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';

@Injectable()
class Interceptor implements HttpInterceptor {
  private readonly http: HttpClient = new HttpClient(this.httpBackend);
  private readonly apiUrl: string = environment.api.url;

  constructor(private readonly httpBackend: HttpBackend) {

  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isLocalRequest = req.url.startsWith('/assets');
    if (isLocalRequest) {
      return this.http.request(req);
    }

    return this.handleRequest(req, next);
  }

  private handleRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.cloneRequest(req));
  }

  private cloneRequest(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      url: `${this.apiUrl}${req.url}`
    });
  }
}

export const ApiInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: Interceptor,
  multi: true
};
