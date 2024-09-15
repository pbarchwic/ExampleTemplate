import { TestBed } from '@angular/core/testing';
import { MatrixService } from './matrix.service';
import { matrixVariables } from '../constants';

describe('PermissionsModule', () => {
  describe('MatrixService', () => {
    let service: MatrixService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [MatrixService],
      });

      service = TestBed.inject(MatrixService);
    });

    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    describe('#getTotalPages', () => {
      it('should return total number of pages, if columns per page more than 0', () => {
        const totalColumns = 17;
        const colsPerPage = 5;
        const result = (service as any).getTotalPages(totalColumns, colsPerPage);
        expect(result).toEqual(4);
      });

      it('should return number of pages, if columns per page is 0', () => {
        const totalColumns = 17;
        const colsPerPage = 0;
        const result = (service as any).getTotalPages(totalColumns, colsPerPage);
        expect(result).toEqual(17);
      });
    });

    describe('#getNewColumnWidth', () => {
      it('should return new width for columns, if there are more columns than 0', () => {
        const avaliableWidth = 500;
        const columns = 5;
        const result = (service as any).getNewColumnWidth(avaliableWidth, columns);
        expect(result).toEqual(100);
      });

      it('should return default width for column, if there are no columns to calculate new width', () => {
        const avaliableWidth = 100;
        const columns = 0;
        const result = (service as any).getNewColumnWidth(avaliableWidth, columns);
        expect(result).toEqual(matrixVariables.minWidthOfColumn);
      });
    });

    describe('#getPageWidth', () => {
      it('should return page width based on number of columns per page and width of one column', () => {
        const widthOfColumn = 120;
        const columnsPerPage = 5;
        const result = (service as any).getPageWidth(columnsPerPage, widthOfColumn);
        expect(result).toEqual(600);
      });
    });

    describe('#getColumnsNumberForFullPage', () => {
      it('should return number of columns which fully fits avaliable space', () => {
        const width = 500;
        const minWidthOfColumn = 120;
        const result = (service as any).getColumnsNumberForFullPage(width, minWidthOfColumn);
        expect(result).toEqual(4);
      });
    });

    describe('#getColumnsNumberForLastPage', () => {
      it('should return number of columns left for last page after previous pages filled fully', () => {
        const noOfColums = 46;
        const colPerFullPage = 8;
        const totalPages = 6;
        const columnsLeftForLastPage = (service as any).getColumnsNumberForLastPage(noOfColums, colPerFullPage, totalPages);
        expect(columnsLeftForLastPage).toEqual(6);
      });
    });

    describe('#getPages', () => {
      it('should return correct number of pages', () => {
        const totalColums = 46;
        const colPerFullPage = 8;
        const colWidth = 100;
        const pages = (service as any).getPages(totalColums, colPerFullPage, colWidth);
        expect(pages.length).toEqual(6);
      });

      it('should return correct width for each page', () => {
        const totalColums = 12;
        const colPerFullPage = 10;
        const colWidth = 100;
        const pages = (service as any).getPages(totalColums, colPerFullPage, colWidth);
        const expectedPages = [1000, 200];
        expect(pages).toEqual(expectedPages);
      });
    });

    describe('#getHorizontalScrollData', () => {
      it('should calculate pages and return pages and new collumn width', () => {
        const element = { offsetWidth: 1000 } as HTMLDivElement;
        const noOfColums = 22;
        const result = service.getHorizontalScrollData(element, noOfColums);
        const expectedResult = {
          columnWidth: 112,
          pages: [1008, 1008, 448],
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
