import * as enums from '../common/enums';

export class Filter {
  modelFieldName: string = '';
  fieldValue: any = '';
  operation: enums.DBOperation = enums.DBOperation.equalTo;
  sortBy: enums.SortOperation = enums.SortOperation.none;
  logicalOperation: enums.LogicalOperation = enums.LogicalOperation.none;
  pairOperation: enums.PairOperation = enums.PairOperation.none;
  isJson: boolean = false;
  dataType : number = 0;

  constructor(modelFieldName: string, fieldValue: any = null, operation = enums.DBOperation.equalTo,
    logicalOperation = enums.LogicalOperation.none, sortBy = enums.SortOperation.none, pairOperation = enums.PairOperation.none,
    isJson = false) {
    this.modelFieldName = modelFieldName;
    this.fieldValue = fieldValue;
    this.operation = operation;
    this.sortBy = sortBy;
    this.logicalOperation = logicalOperation;
    this.pairOperation = pairOperation;
    this.isJson = isJson;
  }

}
export class PagedParams {
  pageNumber: number;
  pageSize: number;
  filters: Array<Filter>;

  constructor(pageNumber: number, pageSize: number, filters: Array<Filter>) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.filters = filters;
  }
}
