import {SortOperation} from './enums';
export class MetaFields {
    modelFieldName: string;
    dbModelFieldName: string;
    headerText: string;
    firstSort: SortOperation;
    secondSort: SortOperation;
    iconClass: string;
    visible: boolean;
    title: string;

    constructor(modelFieldName: string, dbModelFieldName: string, headerText: string, firstSort: SortOperation,
        secondSort: SortOperation, iconClass: string = "", visible: boolean = true) {

        this.modelFieldName = modelFieldName;
        this.dbModelFieldName = dbModelFieldName;
        this.headerText = headerText;
        this.firstSort = firstSort;
        this.secondSort = secondSort;
        this.iconClass = iconClass;
        this.visible = visible;
    }
}
export class DefaultSort {

modelFieldName: string;
sortBy: SortOperation;
ascendingClass: string;
descendingClass: string;

    constructor(modelFieldName: string, sortBy: SortOperation, ascendingClass: string, descendingClass: string) {
        this.modelFieldName = modelFieldName;
        this.sortBy = sortBy;
        this.ascendingClass = ascendingClass;
        this.descendingClass = descendingClass;
    }
}
export class CssClass {
pageButtonEnableClass: string;
pageButtonDisableClass: string;
    constructor(pageButtonEnableClass: string, pageButtonDisableClass: string) {
        this.pageButtonEnableClass = pageButtonEnableClass;
        this.pageButtonDisableClass = pageButtonDisableClass;
    }
}
