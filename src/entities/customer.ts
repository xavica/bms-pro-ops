import { MerchantBusinessType } from './../common/enums';
import { Address } from '.';
import { BusinessType, CustomerRegistrationSource, UserType } from '../common';

export class Customer {

  id: string = "";
  isActive: boolean = false;
  source: number = CustomerRegistrationSource.BulkImport;
  businessType: string = "";
  businessTypeId: number = BusinessType.Kirana;
  name: string = "";
  businessName: string = "";
  gstNumber: string = "";
  nameLowerCase: string = "";
  userTypeId = UserType.Customer;
  email: string = "";
  emailLowerCase: string = "";
  mobileNumber: string = "";
  address: Address = new Address();
  token: string = '';
  profilePicUrl: string = "";
  createdDate: number = new Date().getTime();
  alternativeMobileNumber: string = '';
  gstCertificateUrl: string = '';
  shopUrl: string = '';
  registrationDocumentUrl: string = '';
  photoIdUrl: string = '';
  representativeName: string = '';
  representativeMobileNumber: string = '';
  salesAidInfo: SalesAidInfo;
  businessTagStatus: string = '';
  // Key will be distributor id
  erpInfo: Map<string, { id: string, name: string, distributorId: string }> = new Map();
  authId: string = '';
  isRegistered: boolean = true;
}

export class SalesAidInfo {
  vendorId: string | null;
  erpSalesPersonId: string | null;
  type: MerchantBusinessType;
  manufacture: SalesPersonManufacture | null
}
export class CustomerExcelImport {
  name: any;
  mobileNumber: string;
  email: string;
  businessName: string;
  gstNumber: any;
  street: any;
  area: any;
  city: any;
  state: any;
  pincode: any;
  beatName: string = ''
  latitude: number;
  longitude: number;
}

export class CustomerSearchFields {
  id: string;
  emailLowerCase: string;
  mobileNumber: string;
}

export class SalesPersonManufacture {
  id: string; // Manufacture Id
  name: string;
  distributors: Record<string, { id: string, name: string, vrsId: string }>
}