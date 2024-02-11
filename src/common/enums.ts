import { Customer } from './../entities/customer';
export enum OrderStatus {
  OrderPlaced = 1,
  QuotationRequested = 2,
  OrderConfirmed = 3,
  ReadyForPickup = 4,
  PickedUpOrder = 5,
  ReadyForShipment = 6,
  OutforDelivery = 7,
  Delivered = 8,
  NotDelivered = 9,
  Cancelled = 10,
  CustomerCancellationRequest = 11,
  None = 99
}

export enum RoleType {
  SupportMember = 1,
  TeleCaller = 2,
  InternalDepartment = 3,
  ProductionSupport = 4,
  OnBoardingTeam = 5
}
export enum UserType {
  Customer = 1,
  Dealer = 2,
  Merchant = 3,
  FieldAgent = 4,
  SupportMember = 5,
  MarketingAgent = 6,
  SalesPerson = 7,
  Guest = 99,
  CounterSaleCustomer = 8,
  ViwitoMerchants = 11
}
export enum BMSUserType {
  Vendor = 5,
  Guest = 99,
}


export enum BusinessType {
  Restaurant = 1,
  Kirana = 2,
  Caterers = 3,
  TiffinCenters = 4,
  PgHostel = 5,
  Bakery = 6,
  SweetHouse = 7,
  VegetableShops = 8,
  Institutional = 9,
  Others = 10,
  Tier2Customer = 11,
  Medicals = 12,
  Chemist = 14,
  Cosmetic = 15,
  Supermarket = 16,
  Wholesale = 17,
  RiceTraders = 18,
  OilTraders = 19,
  None = 99
}


export enum MerchantBusinessType {
  Distributor = 1,
  Manufacturer = 2,
  Wholesaler = 3,
  JitVendor = 4,
  Inventory = 5, //for reference=> to tag jit vendor to inventory vendor we are using businessType 5 
  None = 99
}

export enum PrescriptionType {
  prescriptionImageUrl = 1,
  text = 2
}


export interface ValuePair {
  id: number,
  name: string,

}



export var states = [
  {
    "id": 1,
    "name": "Andhra Pradesh",
    "stateCode": 37
  },
  {
    "id": 2,
    "name": "Arunachal Pradesh",
    "stateCode": 12
  },
  {
    "id": 3,
    "name": "Assam",
    "stateCode": 18
  },
  {
    "id": 4,
    "name": "Bihar",
    "stateCode": 10
  },
  {
    "id": 5,
    "name": "Chhattisgarh",
    "stateCode": 22
  },
  {
    "id": 6,
    "name": "Delhi / New Delhi",
    "stateCode": 7
  },
  {
    "id": 7,
    "name": "Goa",
    "stateCode": 30
  },
  {
    "id": 8,
    "name": "Gujarat",
    "stateCode": 24
  },
  {
    "id": 9,
    "name": "Haryana",
    "stateCode": 6
  },
  {
    "id": 10,
    "name": "Himachal Pradesh",
    "stateCode": 2
  },
  {
    "id": 11,
    "name": "Jammu & Kashmir",
    "stateCode": 1
  },
  {
    "id": 12,
    "name": "Jharkhand",
    "stateCode": 20
  },
  {
    "id": 13,
    "name": "Karnataka",
    "stateCode": 29
  },
  {
    "id": 14,
    "name": "Kerala",
    "stateCode": 32
  },
  {
    "id": 15,
    "name": "Madhya Pradesh",
    "stateCode": 23
  },
  {
    "id": 16,
    "name": "Maharashtra",
    "stateCode": 27
  },
  {
    "id": 17,
    "name": "Manipur",
    "stateCode": 14
  },
  {
    "id": 18,
    "name": "Meghalaya",
    "stateCode": 17
  },
  {
    "id": 19,
    "name": "Mizoram",
    "stateCode": 15
  },
  {
    "id": 20,
    "name": "Nagaland",
    "stateCode": 13
  },
  {
    "id": 21,
    "name": "Odisha (Orissa)",
    "stateCode": 21
  },
  {
    "id": 22,
    "name": "Punjab",
    "stateCode": 3
  },
  {
    "id": 23,
    "name": "Rajasthan",
    "stateCode": 8
  },
  {
    "id": 24,
    "name": "Sikkim",
    "stateCode": 11
  },
  {
    "id": 25,
    "name": "Tamil Nadu",
    "stateCode": 33
  },
  {
    "id": 26,
    "name": "Telangana",
    "stateCode": 36
  },
  {
    "id": 27,
    "name": "Tripura",
    "stateCode": 16
  },
  {
    "id": 28,
    "name": "Uttar Pradesh",
    "stateCode": 9
  },
  {
    "id": 29,
    "name": "Uttarakhand",
    "stateCode": 5
  },
  {
    "id": 30,
    "name": "West Bengal",
    "stateCode": 19
  }
];
export class EnumEx {
  static getNames(e: any) {
    return Object.keys(e).filter(v => isNaN(parseInt(v, 10)));
  }

  static getValues(e: any) {
    return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
  }

  static getNamesAndValues(e: any): Array<ValuePair> {
    return EnumEx.getValues(e).map(v => { return { id: v, name: e[v] as string }; });
  }
}

export enum DBOperation {

  unknown = 0, contains = 1, doesNotContain = 2, startsWith = 3, endsWith = 4,
  equalTo = 5, notEqualTo = 6, greaterThan = 7, greaterThanOrEqualTo = 8,
  lessThan = 9, lessThanOrEqualTo = 10, in = 11, notIn = 12, isNULL = 13,
  isNotNull = 14, dateEqual = 15, dateNotEqual = 16, dateGreaterThan = 17,
  dateGreaterThanOrEqual = 18, dateLessThan = 19, dateLessThanOrEqual = 20, orderBy = 21,
  doesNotStartsWith = 22, doesNotEndsWith = 23
}
export enum SortOperation {
  none = 0, ascending = 1, descending = 2
}
export enum LogicalOperation {
  none = 0, and = 1, or = 2
}
export enum PairOperation {
  none = 0, open = 1, close = 2
}
export interface IUserStates {
  customerString: string,
  dealerString: string,
  merchantString: string
}

export enum CustomerRegistrationSource {
  CustomerApp = 1,
  SalesAidApp = 2,
  BulkImport = 3,
  B2B = 4,
  CreatedByMerchant = 5,
  CreatedForCounterSale = 6,
  CounterSaleAidApp = 7
}

export enum Queues {
  Email = 1,
  Vrs = 2,
  Es = 3,
  App = 4,
  Reports = 5
}

export enum PromotionStatus {
  Active = 1,
  InActive = 2,
  All = 3,

}