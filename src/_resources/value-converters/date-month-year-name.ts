export class MonthYearValueConverter {
    toView(value : string) : string {
        let year : number = new Date(value).getFullYear();
        let month : number = new Date(value).getMonth();
        let monthYearValue : string = "";
        switch(month) {
            case 0:
                monthYearValue = 'January - ' + year;
                break;
            case 1:
                monthYearValue = 'Febraury - ' + year;
                break;
            case 2:
                monthYearValue = 'March - ' + year;
                break;
            case 3:
                monthYearValue = 'April - ' + year;
                break;
            case 4:
                monthYearValue = 'May - ' + year;
                break;
            case 5:
                monthYearValue = 'June - ' + year;
                break;
            case 6:
                monthYearValue = 'July -  ' + year;
                break; 
            case 7:
                monthYearValue = 'August - ' + year;
                break;
            case 8:
                monthYearValue = 'September - ' + year;
                break;
            case 9:
                monthYearValue = 'October - ' + year;
                break;
            case 10:
                monthYearValue = 'November - ' + year;
                break;
            case 11:
                monthYearValue = 'December - ' + year;
                break;
            
            default:
                monthYearValue = 'Error ';
                break;
        }
        return monthYearValue;
       
    }

}

/**
 * Usage
 * dateVal = 'December - 1995';
 * <h1 textContent.bind="dateVal | monthYear">Sun Dec 17 1995</h1>
 */
