export class FormatedDateTimeValueConverter {
  toView(date: string): string {
    if (!date) {
      return "-----";
    }
    var givenDate = new Date(date);
    var hours = givenDate.getHours();
    var minutes = givenDate.getMinutes().toString();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = +minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    var time = givenDate.getHours() + ':' + givenDate.getSeconds() + ':' + givenDate.getSeconds();
    var dd: number = givenDate.getDate();
    var mm: number = givenDate.getMonth();
    var yyyy = givenDate.getFullYear();
    var dateWithTime: string = "";
    var monthName: string = "";
    switch (mm) {
      case 0:
        monthName = 'Jan';
        break;
      case 1:
        monthName = 'Feb';
        break;
      case 2:
        monthName = 'Mar';
        break;
      case 3:
        monthName = 'Apr';
        break;
      case 4:
        monthName = 'May';
        break;
      case 5:
        monthName = 'Jun';
        break;
      case 6:
        monthName = 'Jul';
        break;
      case 7:
        monthName = 'Aug';
        break;
      case 8:
        monthName = 'Sept';
        break;
      case 9:
        monthName = 'Oct';
        break;
      case 10:
        monthName = 'Nov';
        break;
      case 11:
        monthName = 'Dec';
        break;

      default:
        monthName = 'mmm';
        break;
    }
    dateWithTime = `${dd}-${monthName}-${yyyy}, ${strTime}`;
    return dateWithTime;
  }
}
