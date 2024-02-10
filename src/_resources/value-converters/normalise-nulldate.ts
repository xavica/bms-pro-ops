export class NormaliseNullDateValueConverter {
    toView(value: string): string {
        let result: string;
        if (value.indexOf('0001') > -1) {
            result = 'Not Yet Set';
        }
        else {
            result = new Date(value).toDateString();
        }
        return result;
    }
}