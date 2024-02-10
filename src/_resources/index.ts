export function configure(aurelia) {

  var resourcePaths: Array<string> = [
    './value-converters/array-random',
    './value-converters/currency',
    './value-converters/date-day-name',
    './value-converters/date-day-number',
    './value-converters/date-normalise',
    './value-converters/date-year',
    './value-converters/default-value',
    './value-converters/first-item',
    './value-converters/last-item',
    './value-converters/numeric-to-number',
    './value-converters/object-to-string',
    './value-converters/string-capitalize',
    './value-converters/string-cut',
    './value-converters/string-to-lowercase',
    './value-converters/string-to-uppercase',
    './value-converters/string-truncate',
    './value-converters/blob-to-url',
    './value-converters/file-to-list',
    './value-converters/image-to-path',
    './value-converters/date-month-year-name',
    './value-converters/date-ddmmyyyy',
    './value-converters/date-yyyymmdd',
    './value-converters/date-plus-365',
    './value-converters/formated-DateTime',
    './value-converters/normalise-nulldate',
    './value-converters/currency-converter',
    './value-converters/timedate-converter',
    './value-converters/order-status',
    './value-converters/days-difference',
    './value-converters/dd-mm-yy-hh-mm',
    './value-converters/business-type.ts',
    './value-converters/customer-source.ts',
    './value-converters/merchant-businesstype.ts',
    './value-converters/paginate.ts',
    './value-converters/promotion-paginate.ts',


  ];
  aurelia.globalResources(resourcePaths);
}
