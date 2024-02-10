export class MerchantBusinessValueConverter {
    toView(value : number): string {
        var source: string = "";
        switch (value) {
            case 1: source = "Distributor";
                break;
            case 2: source = "Manufacturer";
                break;
            case 3: source = "Wholesaler";
                break;
            default: source = "UnKnown";
                break;
        }
        return source;
    }
}
