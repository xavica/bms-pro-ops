export class TruncateValueConverter {
    toView(value : string, length : number = 10) : string{
        return value.length > length ? value.substring(0, length) + '...' : value;
    }
}


/**
 * Usage
 *
 * <require from="string-truncate"></require>
 * stringVal = 'I am a robot and this is my CPU';
 * <h1 textContent.bind="stringVal | truncate:10">I am a rob...</h1>
 */
