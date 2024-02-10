export class FirstValueConverter {
    toView(value : string) : Object {
        if (!value || !value.length) {
            return value;
        }

        if (Array.isArray(value)) {
            return value[0];
        } else {
            var str : Object = value.toString ? value.toString() : Object.prototype.toString.call(value);
            if (str === '[object Object]') {
                let theKey = Object.keys(value)[0];
                return {theKey : value[theKey]};
            }
        }

        return value;
    }
}
