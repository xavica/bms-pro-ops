export class DayNameValueConverter {
    toView(value : number) : string {
        let dateStr : number =  new Date(value).getDay();
        let  day : string  = ""; 
        switch(dateStr ) {
            case 0:
                day = "Sunday";
            break;
            case 1:
                day = "Monday";
            break;
            case 2:
                day = "Tuesday";
            break;
            case 3:
                day = "Wednesday";
            break;
            case 4:
                day = "Thursday";
            break;
            case 5:
                day = "Friday";
            break;
            case 6:
                day = "Saturday";
            break;
            default:
                day = "Error";
            break;
        }
        return day;
    }
}


/**
 * Usage
 * Gets the current day name from a supplied Date String
 *
 * <require from="date-day-name"></require>
 * dateVal = 'December 17, 1995 03:24:00';
 * <h1 textContent.bind="dateVal | dayName">Sunday</h1>
 */
