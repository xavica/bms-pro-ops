import { BusinessType } from "./enums";

export function generatePassword() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
export function generatePromotionId() {
  var text = "PROMOIMG";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
export function areEqual(obj1: {}, obj2: {}) {
  return Object.keys(obj1).every((key) => {
    return obj2.hasOwnProperty(key) && (obj1[key] == obj2[key]);
  });
};
export function isValidEmail(email: string) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
export function isValidBusinessName(name: string) {
  var reg = /^[a-zA-Z0-9& ]{1,100}$/;
  return reg.test(name);
}
export function isValidName(name: string) {
  var reg = /^[a-zA-Z& ]{2,100}$/;
  return reg.test(name);
}
export function isValidMobileNumber(name: string) {
  var reg = /^[6-9]\d{9}$/;
  return reg.test(name) && name.toString().length == 10;
}
export function isValidPincode(pin: string) {
  var reg = /^\d{6}$/;
  return reg.test(pin) && pin.toString().length == 6;
}
export function isEmptyValue(data: string) {
  if (data === " " || data === "" || data == "0" || data === undefined || data === null) {
    return true;
  }
  return false;
}
export function isValidGstNumber(name: string) {
  var reg = /^([0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[0-9]{1}[Zz]{1}[0-9a-zA-Z]{1}){0,15}$/;
  return reg.test(name);
}

export function isValidAddress(name: string) {
  var reg = /^[a-zA-Z\ ]*$/;
  return reg.test(name);
}


export function validateLatAndLong(lat: any) {
  var reg = /^[0-9]\d{0,1}(\.\d{4,10})$/;

  return lat && reg.test(lat);
}
export function isEmptyNumber(data: number) {
  if (data === undefined || data === null || data === 0) {
    return true;
  }
  return false;
}
export function validateDecimal(decimalNumber: any) {
  var reg = /^[0-9]{0,6}\d*(\.\d{0,2})?$/
  return reg.test(decimalNumber);
}

export function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a === null ||
    typeof a !== "object" ||
    b === null ||
    typeof b !== "object") {
    return false;
  }
  var propsInA = 0;
  var propsInB = 0;
  for (var prop in a) {
    propsInA += 1;
  }
  for (var prop in b) {
    propsInB += 1;

    if (!(prop in a) || !deepEqual(a[prop], b[prop]))
      return false;
  }
  return propsInA === propsInB;
}
// export function getInvoiceGuid() {
//   var text = "";
//   var possible = "0123456789";
//   for (var i = 0; i < 10; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return `INV-QWIPO-${text}`;
// }
export function getInvoiceGuid(city: string, type: string = "") {
  var text = "";
  var possible = "0123456789";
  let cityWithoutSpaces = city.replace(/ /g, '');
  let cityId = cityWithoutSpaces.substr(0, 3).toUpperCase();
  var year = new Date().getFullYear();
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return `QWI-${cityId}-${year}-${type}${text}`;
}
export function getMerchantQwipoInvoiceGuid(shopName: any, shopCity: any) {
  var text = "";
  var possible = "0123456789";
  var year = new Date().getFullYear();
  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  let shopNameWithoutSpaces = shopName.replace(/ /g, '');
  let shopCityWithoutSpaces = shopCity.replace(/ /g, '');
  let shopId = shopNameWithoutSpaces.substr(0, 3).toUpperCase();
  let cityId = shopCityWithoutSpaces.substr(0, 3).toUpperCase();
  return `${shopId}-${cityId}-${year}-V${text}`;
}
export function getMerchantInvoiceGuid(shopName: any, shopCity: any) {
  var text = "";
  var possible = "0123456789";
  var year = new Date().getFullYear();
  for (var i = 0; i < 4; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  let shopNameWithoutSpaces = shopName.replace(/ /g, '');
  let shopId = shopNameWithoutSpaces.substr(0, 3).toUpperCase();
  let cityWithoutSpaces = shopCity.replace(/ /g, '');
  let cityId = cityWithoutSpaces.substr(0, 3).toUpperCase();
  return `${shopId}-${cityId}-${year}`;
}
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
export function unique(values) {
  let n: any = {}, r: any = [];
  for (let i = 0; i < values.length; i++) {
    if (!n[values[i]]) {
      n[values[i]] = true;
      r.push(values[i]);
    }
  }
  return r;
}
export function getOrderNumberGuid() {
  let date = new Date();
  let dateUid = date.getFullYear() + "" + date.getMonth() + "" +
    date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" +
    date.getSeconds() + "" + date.getMilliseconds();
  let str = "";
  for (let i = 0; i < dateUid.length; i++) {
    str += dateUid.charAt(Math.floor(Math.random() * dateUid.length));
  }
  let result = "QWIP" + str;
  return result;
}
export function toCustomArray(object: Object = {}) {
  object = object || {};

  return Object.keys(object)
    .map(key => {
      let actualObject = object[key];
      let idExists = Object.keys(actualObject).some(property => property === "id");
      actualObject["id"] = key;
      return object[key];
    });
}
export function toCustomObject(array) {
  return array.reduce((result, item) => {
    result[item.id] = item;
    return result;
  }, {});
}
export function getStartDayOfMonthTimeStamp(selectedDate: Date) {
  // let date = new Date();
  let firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  let formattedFirstDay = firstDay.getDate() + "-" + (firstDay.getMonth() + 1) + "-" + firstDay.getFullYear();
  return getTimeStamp(formattedFirstDay);
}
function getTimeStamp(myDate) {
  myDate = myDate.split("-");
  let newDate = myDate[1] + "/" + myDate[0] + "/" + myDate[2];
  return new Date(newDate).getTime();
}
export function getEndDayOfMonthTimeStamp(selectedDate: Date) {
  // let date = new Date();
  let lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  let formattedLastDay = lastDay.getDate() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getFullYear();
  return getTimeStamp(formattedLastDay);
}


// export function roundAmount(amount: number, toDecimalValue: number) {
//   return Math.round(amount * toDecimalValue) / toDecimalValue;
// }
/**
 *
 * @param amount
 * @param toDecimalValue -- by default will round to 2 digits.
 * @returns
 */
export function roundAmount(amount: number, toDecimalValue: number = 2) {
  // return Math.round(amount * toDecimalValue) / toDecimalValue;
  if (typeof amount == "string") {
    amount = +amount;
  }
  return +(amount.toFixed(toDecimalValue));
}
export function getUniqReferrel() {
  var str = "";
  var num = "";
  var possible = "ABCDEFGHIJKLMNQRSTUVWXYZ";
  var possibleNum = "1234567890";

  for (var i = 0; i < 4; i++) {
    str += possible.charAt(Math.floor(Math.random() * possible.length));

  }
  for (var i = 0; i < 4; i++) {
    num += possibleNum.charAt(Math.floor(Math.random() * possibleNum.length));
  }
  return `MR${str}${num}`;
}
// export function toCustomArray () {
//     return Object.keys(this)
//         .map(key => this[key]);
// };

// interface Array {
//     toCustomObject?: any;
// }
// Array.prototype.toCustomObject = function () {
//     return this.reduce((result, item) => {
//         result[item.id] = item;
//         return result;
//     }, {});
// };

export function getYears() {
  var currentYear = new Date().getFullYear(), years: Array<number> = [],
    startYear: number = 2017;

  while (startYear <= currentYear) {
    years.push(startYear++);
  }
  return years.sort(function (a, b) { return b - a });
}

export function getFormattedDate() {
  let d = new Date(),
    dformat = [d.getDate(),
    (d.getMonth() + 1),
    d.getFullYear()].join('-');
  return dformat;
}
// export function getMerchantInvoiceGuid(shopName, shopCity) {
//   var text = "";
//   var possible = "0123456789";
//   var year = new Date().getFullYear();
//   for (var i = 0; i < 4; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   let shopNameWithoutSpaces = shopName.replace(/ /g, '');
//   let shopCityWithoutSpaces = shopCity.replace(/ /g, '');
//   let shopId = shopNameWithoutSpaces.substr(0, 3).toUpperCase();
//   let cityId = shopCityWithoutSpaces.substr(0, 3).toUpperCase();
//   return `${shopId}-${text}-${year}`;
// }
// export function getMerchantQwipoInvoiceGuid(shopName: any, shopCity: any) {
//   var text = "";
//   var possible = "0123456789";
//   var year = new Date().getFullYear();
//   for (var i = 0; i < 8; i++) {
//       text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   let shopNameWithoutSpaces = shopName.replace(/ /g, '');
//   let shopCityWithoutSpaces = shopCity.replace(/ /g, '');
//   let shopId = shopNameWithoutSpaces.substr(0, 3).toUpperCase();
//   let cityId = shopCityWithoutSpaces.substr(0, 3).toUpperCase();
//   return `${shopId}-${cityId}-${year}-${text}`;
// }
export function getAutoNumber() {
  var text = "";
  var possible = "0123456789";
  for (var i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


export function getBusinessTypes() {
  const businessTypePrices = [
    {
      isSelected: true,
      businessTypeId: BusinessType.Kirana,
      name: 'Kirana'
    },
    {
      isSelected: true,
      businessTypeId: BusinessType.Restaurant,
      name: 'Restaurant'
    },
    {
      isSelected: true,
      businessTypeId: BusinessType.Caterers,
      name: 'Caterers'
    },
    {
      isSelected: true,
      businessTypeId: BusinessType.TiffinCenters,
      name: 'TiffinCenters'
    },
    {
      isSelected: true,
      businessTypeId: BusinessType.PgHostel,
      name: 'PG/Hostel'
    },
    {
      isSelected: true,
      businessTypeId: BusinessType.Bakery,
      name: 'Bakery'
    },
    {
      isSelected: true,
      businessTypeId: BusinessType.SweetHouse,
      name: 'Sweet House'
    },
    {
      isSelected: true,
      businessTypeId: BusinessType.VegetableShops,
      name: 'Vegetable shops'
    },
    {
      isSelected: false,
      businessTypeId: BusinessType.Institutional,
      name: 'Institutional'
    },
    {
      isSelected: true,
      businessTypeId: BusinessType.Others,
      name: 'Others'
    },
    {
      isSelected: false,
      businessTypeId: BusinessType.Tier2Customer,
      name: 'Tier2Customer'
    }
  ];
  return businessTypePrices;
}

export function getDateFormat(d = new Date()): string {
  var givenDate = d;
  var dd: string = givenDate.getDate().toString();
  var mm: string = (givenDate.getMonth() + 1).toString();

  var yyyy = givenDate.getFullYear();
  if (+dd < 10) {
    dd = '0' + dd
  }
  if (+mm < 10) {
    mm = '0' + mm
  }
  var dateContext = `${yyyy}-${mm}-${dd}`;
  return dateContext;
}

export function groupBy(arr, prop) {
  var map: any = new Map();
  map = new Map(Array.from<[any, any], [any, any]>(arr, (obj: Array<any>) => [obj[prop], []]));
  arr.forEach((obj: Array<any>) => map.get(obj[prop]).push(obj));
  return Array.from(map.values());
}


export function getUUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}


export function uuidv4() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


$('body').on('keypress keyup click paste change', ".OnlyNumber", function (event) {
  var $this = $(this);
  if (((event.which < 48 || event.which > 57) &&
    (event.which != 0 && event.which != 8))) {
    event.preventDefault();
  }
  var text = $(this).val();
  if ((text.indexOf('0') != -1) &&
    (text == '0') &&
    (event.which != 0 && event.which != 8)) {
    $this.val('');
    return;
  }
  if ((text < 0)) {
    setTimeout(function () {
      $this.val('');
      return;
    }, 1);

  }
  if ($(this).val().length > 10) {
    return false;
  }
});
$('body').on('keypress keyup click change', ".OnlyDecimal", function (event) {
  var $this = $(this);
  if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
    ((event.which < 48 || event.which > 57) &&
      (event.which != 0 && event.which != 8))) {
    event.preventDefault();
  }

  var text = $(this).val();
  if ((event.which == 46) && (text.indexOf('.') == -1)) {
    setTimeout(function () {
      if ($this.val().substring($this.val().indexOf('.')).length > 3) {
        $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
      }
    }, 1);
  }

  // if ((text.indexOf('.') != -1) &&
  //         (text.substring(text.indexOf('.')).length > 2) &&
  //         (event.which != 0 && event.which != 8) &&
  //         ($(this)[0].selectionStart >= text.length - 2)) {
  //     event.preventDefault();
  // }
  if ($(this).val().length > 10) {
    return false;
  }
});



export function getAddressString(address: any = {}): string {
  let addressString: string = "";
  if (address != null && Object.keys(address).length) {
    addressString = `${address.street},${address.area}, ${address.city}, ${address.state} - ${address.pincode},
    
    Lat -${address.latitude},Long -  ${address.longitude}`;
  }

  return replaceAll(addressString, 'undefined', '');
}

function replaceAll(string: string, search: string, replace: string) {

  return string.split(search).join(replace);
}

export function getSwalMessage(title: string, text: string, type: string) {

  return {
    title: title,
    text: text,
    type: type,
    showCancelButton: true,
    confirmButtonColor: "#13BB6F",
    confirmButtonText: "Yes,Proceed.!",
    closeOnConfirm: true
  };

}