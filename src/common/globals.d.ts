interface Array<T> {
    toCustomObject(): any;
    sortElements(name: string): any;
    sum(prop : string): any;
}

interface Object {
    toCustomArray(): Array<any>;
}
