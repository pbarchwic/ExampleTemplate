import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { RefreshPermissionData } from '@app/shared';
import { HorizontalScrollData } from '../models';
import { matrixVariables } from '../constants';

@Injectable()
export class MatrixService {
  public readonly refreshPermissionInMatrix$ = new BehaviorSubject<RefreshPermissionData>(undefined);
  public readonly forceRefreshPermissions$ = new Subject<void>();

  constructor() {}

  public getHorizontalScrollData({ offsetWidth }: HTMLDivElement, noOfColums: number): HorizontalScrollData {
    const { minWidthOfColumn } = matrixVariables;
    const colsPerFullPage = this.getColumnsNumberForFullPage(offsetWidth, minWidthOfColumn);
    const matrixColWidth = this.getNewColumnWidth(offsetWidth, colsPerFullPage);
    const pages = this.getPages(noOfColums, colsPerFullPage, matrixColWidth);
    return {
      columnWidth: matrixColWidth,
      pages,
    };
  }

  private getPages(totalColums: number, colPerFullPage: number, colWidth: number): number[] {
    const totalPages = this.getTotalPages(totalColums, colPerFullPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      const colPerPage = i < totalPages ? colPerFullPage : this.getColumnsNumberForLastPage(totalColums, colPerFullPage, totalPages);
      pages.push(this.getPageWidth(colPerPage, colWidth));
    }
    return pages;
  }

  private getTotalPages(noOfColums: number, colPerFullPage: number): number {
    return Math.ceil(noOfColums / (colPerFullPage > 0 ? colPerFullPage : 1));
  }

  private getNewColumnWidth(avaliableWidth: number, columns: number): number {
    return columns > 0 ? Math.ceil(avaliableWidth / columns) : matrixVariables.minWidthOfColumn;
  }

  private getPageWidth(colPerPage: number, matrixColWidth: number): number {
    return matrixColWidth * colPerPage;
  }

  private getColumnsNumberForFullPage(width: number, minWidthOfColumn: number): number {
    return Math.floor(width / minWidthOfColumn);
  }

  private getColumnsNumberForLastPage(noOfColums: number, colPerFullPage: number, totalPages: number): number {
    return noOfColums - colPerFullPage * (totalPages - 1);
  }
}
