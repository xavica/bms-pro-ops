export class DiffrenceInDaysValueConverter {
    toView(value: number) {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var firstDate = new Date();
        var secondDate = new Date(value);
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    }
}