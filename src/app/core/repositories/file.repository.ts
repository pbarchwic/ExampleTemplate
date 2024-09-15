import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Injectable()
export class FileRepository {
  private readonly http: HttpClient = new HttpClient(this.httpBackend);

  constructor(
    private readonly httpBackend: HttpBackend
  ) {}

  public getBlob(url: string): Promise<Blob> {
    return new Promise((resolve) =>
      this.http.get(url, { responseType: 'blob' })
        .subscribe((response) => resolve(response), () => resolve()));
  }
}
