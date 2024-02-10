import * as enums from './enums';
import { MetaFields, DefaultSort, CssClass } from './metaFields';


export class DBGrid {
  //defaultSort =>{"modelFieldName": "","sortBy": enums.SortOperation.descending, "ascendingClass": "zmdi zmdi-chevron-up zmdi-hc-lg", "descendingClass":"zmdi zmdi-chevron-down zmdi-hc-lg"};
  //css => {pageButtonEnableClass: '', pageButtonDisableClass ; ''}

  defaultSort: DefaultSort;
  pageSize: number;
  css: CssClass;
  totalRecords: number;
  numberOfPages: number;
  setSize: number;
  pageNumber: number;
  startSetNumber: number;
  displaySet: Array<number>;
  startRecordNumber: number;
  endRecordNumber: number;
  firstEnable: boolean;
  previousEnable: boolean;
  nextEnable: boolean;
  lastEnable: boolean;
  firstEnableDisableCss: string;
  previousEnableDisableCss: string;
  nextEnableDisableCss: string;
  lastEnableDisableCss: string;

  constructor() {
    this.defaultSort = new DefaultSort("LastUpdatedDate", enums.SortOperation.descending,
      "zmdi zmdi-chevron-up zmdi-hc-lg", "zmdi zmdi-chevron-down zmdi-hc-lg");
    this.pageSize = 25;
    this.css = {
      pageButtonEnableClass: '',
      pageButtonDisableClass: 'disabled'
    };
    this.totalRecords = 0;
    this.numberOfPages = 0;
    this.setSize = 4;
    this.pageNumber = 1;
    this.startSetNumber = 1;
    this.displaySet = [];
    this.startRecordNumber = 1;
    this.endRecordNumber = this.pageSize;
    this.firstEnable = false;
    this.previousEnable = false;
    this.nextEnable = false;
    this.lastEnable = false;
    this.firstEnableDisableCss = '';
    this.previousEnableDisableCss = '';
    this.nextEnableDisableCss = '';
    this.lastEnableDisableCss = '';

  }
  refresh(recordsCount: number) {
    this.totalRecords = recordsCount;
    this.numberOfPages = Math.ceil(this.totalRecords / this.pageSize);
    this.findDisplayPageSet();
  }
  setPageNumber(pageNumber: number) {
    if (pageNumber > this.numberOfPages) {
      this.pageNumber = this.numberOfPages;
    } else {
      this.pageNumber = pageNumber > 0 && pageNumber || 1;
    }
    // this.pageNumber = pageNumber
  }
  setFirstPage() {
    this.setPageNumber(1);
    this.findDisplayPageSet();
  }
  setPreviousPage() {
    this.setPageNumber(this.pageNumber - 1);
    this.findDisplayPageSet();
  }
  setNextPage() {
    this.setPageNumber(this.pageNumber + 1);
    this.findDisplayPageSet();
  }
  setLastPage() {
    this.setPageNumber(this.numberOfPages);
    this.findDisplayPageSet();
  }

  setPageSize(pageSize: number) {
    this.setPageNumber(1);
    this.pageSize = pageSize;
    this.findDisplayPageSet();
  }
  findDisplayPageSet() {
    let temp = this.pageNumber % this.setSize;
    if (temp === 0) {
      temp = this.setSize;
    }
    let startSetNumber = this.pageNumber - temp + 1;
    let result: Array<number> = [];
    for (let index = 0; index < this.setSize; index++) {
      let setNumber = startSetNumber + index;
      if (setNumber <= this.numberOfPages) {
        result.push(startSetNumber + index);
      }
    }
    this.displaySet = result;
    this.startRecordNumber = (this.pageNumber - 1) * this.pageSize + 1;
    let endRecord = this.pageNumber * this.pageSize;
    this.endRecordNumber = (endRecord > this.totalRecords) && this.totalRecords || endRecord;
    this.enablePageNumbers();
  }

  getPageButtonCss(buttonEnable: boolean) {
    return buttonEnable ? this.css.pageButtonEnableClass : this.css.pageButtonDisableClass;
  }
  enablePageNumbers() {
    this.firstEnable = this.pageNumber !== 1;
    this.firstEnableDisableCss = this.getPageButtonCss(this.firstEnable);
    this.previousEnable = this.pageNumber !== 1;
    this.previousEnableDisableCss = this.getPageButtonCss(this.previousEnable);
    this.nextEnable = this.pageNumber !== this.numberOfPages;
    this.nextEnableDisableCss = this.getPageButtonCss(this.nextEnable);
    this.lastEnable = this.pageNumber !== this.numberOfPages;
    this.lastEnableDisableCss = this.getPageButtonCss(this.lastEnable);
  }
}
