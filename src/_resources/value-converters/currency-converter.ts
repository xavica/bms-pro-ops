export class ConvertCurrencyValueConverter {
    toView(value: number, config) {
        if (config.currencyVal === "1") {
            return value;
        }
        else {
            var currencyValueInput = config.currencyVal;
            var markupInput = config.markup;
            var markup = Number(markupInput.replace(/[^0-9\.-]+/g, ""));
            var currencyValue = Number(currencyValueInput.replace(/[^0-9\.-]+/g, ""));
            var myCurrencyValue = currencyValue - 4;
            var amount = value / myCurrencyValue;
            var markupValue = amount + (amount * 20 / 100);
            var x = markupValue % 5;
            return x <= 2.5 ? (Math.round(markupValue) - Math.round(x)) :
                (Math.round(markupValue) + (5 - Math.round(x)));
        }

    }
}
// var rate = 51.503;
// var myrate = rate - 4;
// var amount = 2000/ myrate;
// var markupValue = amount + (amount *  20/100);
// var x = markupValue % 5;
// markupValue =  x <= 2.5 ? (Math.round(markupValue) - Math.round(x)) :
//                                   (Math.round(markupValue)  + (5 - Math.round(x)));

/**
 * Usage
 *
 * <require from="currency"></require>
 * amount = 100000;
 * <h1 textContent.bind="amount | convertCurrency : {currencyVal: '74.4369', markup: '20' }"></h1>
 */
