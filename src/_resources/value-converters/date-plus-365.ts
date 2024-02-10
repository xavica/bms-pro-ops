export class DatePlus365ValueConverter {
    toView(value : string) : string {
        var givenDate : Date = new Date(value);
        return new Date(givenDate.setDate(givenDate.getDate() + 365)).toDateString();
    }
}