export class ToNumberValueConverter {
    toView(value : string) : number {
        return parseInt(value);
    }
}


/**
 * Usage
 *
 * <require from="numeric-to-number"></require>
 * myStringNumber = '200';
 * <h1 textContent.bind="myStringNumber | toNumber">200</h1>
 */
