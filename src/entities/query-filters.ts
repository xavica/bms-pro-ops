export class QueryFilter {
    fieldName: string;
    fieldValue: string;
    constructor(fieldName: string, fieldValue: string) {
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}