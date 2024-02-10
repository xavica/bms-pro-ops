export class DateDateMonthYearValueConverter {
    toView(value : string) : string {
        var givenDate = new Date(value);
        var dd : string = givenDate.getDate().toString();
        var mm : string = (givenDate.getMonth() + 1).toString(); //January is 0!

        var yyyy = givenDate.getFullYear();
        if (+dd < 10) {
            dd = '0' + dd
        }
        if (+mm < 10) {
            mm = '0' + mm
        }
        var dateContext = dd + '/' + mm + '/' + yyyy;
        return dateContext;
    }
}
/**
 * Usage
 * <require from="date-year"></require>
 * dateVal = '17/12/1995';
 * <h1 textContent.bind="dateVal | dateYear">'December 17, 1995 03:24:00'</h1>
 */