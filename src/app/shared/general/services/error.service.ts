import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ErrorService {

  constructor(
    private readonly router: Router
  ) {}

  public open404(error: Error): void{
    if (error instanceof HttpErrorResponse && error.status === 404) {
      this.router.navigateByUrl('/', {replaceUrl: true});
    }
  }
}
