export class DateTimeValueConverter {
    toView(value: string): string {
        if (value) {
            var givenDate = new Date(value);
            var date = givenDate.toLocaleDateString();
            var time = givenDate.toLocaleTimeString();
            var dateTimeContext = `${date} ${time}`;
            return dateTimeContext;
        }
        else {
            return "------";
        }

    }
}
/**
 * Usage
 * <require from="date-year"></require>
 * dateVal = '17/12/1995';
 * <h1 textContent.bind="dateVal | dateYear">'December 17, 1995 03:24:00'</h1>
 */