import { Merchant } from './../entities/merchant';
import { Customer } from './../entities/customer';
import { FirebaseService } from './firebase.service';
import { HttpClient } from 'aurelia-fetch-client';
import { DataService } from './data.service';
import { BaseConfig, BusinessType, CustomerRegistrationSource, IConfig, toCustomArray, UserType, uuidv4 } from '../common';
import { DB_PATH } from '../constants';
import { getCustomerDocImgUrl, getCustomerUploadDocUrl } from '../common/workflow-endpoints';
import { VrsMerchantAPIKeys } from '../entities/vrs-merchant-keys';
import { ItemDetailsRequestEntity } from '../entities/testing-module-requests';
import { CounterSaleCustomer } from '../entities/counter-sale-customer';

export class CustomerService extends DataService {
  controller: string;
  firebaseService: FirebaseService;
  constructor(httpClient: HttpClient, baseConfig: BaseConfig, _firebaseService: FirebaseService) {
    super(httpClient, baseConfig, _firebaseService);
    this.controller = '';
    this.firebaseService = _firebaseService;
  }

  /* Firebase FB - DB Postgress */


  async getCustomerFB(customerId: string) {

    return this.firebaseService.getData(`${DB_PATH.CUSTOMER}/${customerId}`);
  }

  async updateCustomerFB(customerId: string, updateObj: any = {}) {

    return this.firebaseService.update(`${DB_PATH.CUSTOMER}/${customerId}`, updateObj)
  }


  async addCustomerFB(customerId: string, customerObj: any = {}) {

    return this.firebaseService.insert(`${DB_PATH.CUSTOMER}/${customerId}`, customerObj);
  }

  async updateCustomerDocsInFB(fileName: string, fileURL: string, customerId: string) {

    const key: string = this.mapToDocKey(fileName);
    const updateObject = {};
    updateObject[key] = fileURL;

    return this.firebaseService.update(`${DB_PATH.CUSTOMER}/${customerId}`, updateObject)
  }


  async customerSearchFB(searchFiled: string, searchValue: string) {
    try {
      const response = await this.firebaseService.getDataByFilters(`${DB_PATH.CUSTOMER}`, searchFiled, searchValue);
      const customers: Array<any> = [];
      for (var key in response) {
        customers.push(response[key]);
      }
      return customers || []
    } catch (error) {
      console.log("customerSearchFb:::", error);

      throw error;
    }
  }



  async getCustomerBySearchFeild(searchFiled: string, searchValue: string) {
    try {
      const customers = await this.customerSearchFB(searchFiled, searchValue);

      return customers && customers[0] || [];
    } catch (error) {
      console.log("GetCustomerBySearchFeildError:::", error);

      throw error;
    }
  }

  async uploadCustomerDocInDigitalOcean(customerId: string, fileName: string, file: any) {
    try {
      const fullUrl = `${getCustomerUploadDocUrl(this.config.env)}/${customerId}/${fileName}`;

      return this.put(fullUrl, file, undefined);
    } catch (error) {

      throw error;
    }
  }

  async getCustomerDocImageUrl(customerId: string, fileName: string) {

    return `${getCustomerDocImgUrl(this.config.env)}/${customerId}/${fileName}`;
  }

  async getCustomersByMobileNumbersDB(mobileNumbers: any) {
    try {

      return this.post(`${this.config.apiCoreUrl}/Customer/customers_by_mobile_numbers`, mobileNumbers, undefined, true);
    } catch (error) {
      console.log("getCustomerAccountTranctionsError:::", error);

      return [];
    }
  }

  async getCustomersByEmailIdsDB(emails: any) {
    try {

      return this.post(`${this.config.apiCoreUrl}/Customer/customers_by_emaild_ids`, emails, undefined, true);
    } catch (error) {
      console.log("Sql Order Service getCustomersByEmailds Error :::", error);

      return [];
    }
  }

  async getUnregisteredCustomersDB() {
    try {

      return this.get(`${this.config.apiCoreUrl}/Customer/unregistered_customers`, undefined, undefined, true);
    } catch (error) {
      console.log("Sql Order Service getUnregisteredCustomers Error :::", error);

      return [];
    }
  }

  async getAllCustomersFromErp(vrsMerchantKeys: VrsMerchantAPIKeys) {
    try {
      const fullUrl: string = `${vrsMerchantKeys.apiUrl}/api/method/viwito.api.customer.get_customer_list`;
      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
      }
      const response = await this.get(fullUrl, undefined, options, true, true);

      const result = response && response.message && Array.isArray(response.message) ? response.message : [];

      return result;
    } catch (error) {

      return []
    }
  }
  
  async createCounterSaleCustomer(merchant: Merchant, merchantInfo) {
    try {

      // map customer for saving in firebase
      const counterSaleCustomerToInsert = this.mapToCreateCounterSaleCustomer(merchant, merchantInfo);
      const authPassWord: string = `@${counterSaleCustomerToInsert.authId.slice(0, 4)}*${counterSaleCustomerToInsert.mobileNumber.slice(-5)}`;
      console.log("authPassWord:::", authPassWord);
      // Add customer in Firebase Auth

      const createCustomerAuthResponse = await this.firebaseService.createUserWithEmailAndPassword(counterSaleCustomerToInsert.authId, authPassWord);
      counterSaleCustomerToInsert.id = createCustomerAuthResponse && createCustomerAuthResponse.uid;

      // Add customer in firebase
      await this.firebaseService.insert(`${DB_PATH.CUSTOMER}/${counterSaleCustomerToInsert.id}`, counterSaleCustomerToInsert);
      const salesPersonToSave = { id: counterSaleCustomerToInsert.id, name: counterSaleCustomerToInsert.name, mobileNumber: counterSaleCustomerToInsert.mobileNumber };

    } catch (error) {

      console.log(` Customer Service counterSaleCustomer error ::: `, error);
    }

  }

  async insertCustomerVrs(customer: { customer_name: string, customer_id: string, street: string, city: string, country: string, data: {} } | any, vrsMerchantKeys: VrsMerchantAPIKeys) {

    try {

      const fullUrl: string = `${vrsMerchantKeys.apiUrl}/api/method/viwito.api.customer.create_customer`;

      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
      }
      const response = await this.post(fullUrl, customer, options, true, true);

      console.log("insertCustomerVrs response", response);

      return response && response.message;

    } catch (error) {

      console.log(`customerService insertCustomerVrs Error ::: `, error);

      swal("", "Please fill the valid Details.", "warning");

      throw new Error(JSON.stringify(error))
    }
  }
  
  async getCustomerVrs(customerId:string,vrsMerchantKeys: VrsMerchantAPIKeys){
  try{
    const fullUrl:string = `${vrsMerchantKeys.apiUrl}/api/method/viwito.api.customer.get_customer_details?customer_id=${customerId}`;
    const options: any = {
      Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
    }
    const response = await this.get(fullUrl, undefined, options, undefined, true);

    console.log("getCustomerVrs response", response);

    return response && response.message;
  } catch (error) {
    console.log("getCustomerVrs::::",error)
  }}


     

  async getAllSalesPersonsFromErp(vrsMerchantKeys: VrsMerchantAPIKeys) {
    try {
      const fullUrl: string = `${vrsMerchantKeys.apiUrl}/api/method/viwito.api.sales_person.get_sales_person`;
      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
      }
      const response = await this.get(fullUrl, undefined, options, true, true);

      return response && response.message || [];
    } catch (error) {

      throw error;
    }
  }



  async createCustomerInErp(vrsMerchantKeys: VrsMerchantAPIKeys, customerInfo: any) {

    try {

      const fullUrl: string = `${vrsMerchantKeys.apiUrl
        }/api/method/viwito.api.customer.create_customer`;
      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
      }
      const response = await this.post(fullUrl, customerInfo, options, true, true);
      
      return response;
    } catch (error) {
      throw error;
    }
  }


  //#region private methods

  private mapToDocKey(key: string) {

    return {
      gst_certificate: 'gstCertificateUrl',
      shop_image: 'shopUrl',
      reg_doc: 'registrationDocumentUrl',
      photo_id: 'photoIdUrl'
    }[key] || ""
  }

  private mapToCreateCounterSaleCustomer(customer: Merchant, merchantInfo) {
    return {
      id: uuidv4(),
      isActive: true,
      source: CustomerRegistrationSource.CreatedForCounterSale,
      businessType: 'Kirana',
      businessTypeId: BusinessType.Kirana,
      name: 'Counter Sale',
      businessName: 'Counter Sale',
      gstNumber: '',
      nameLowerCase: 'counter sale',
      userTypeId: UserType.CounterSaleCustomer,
      email: '',
      emailLowerCase: '',
      mobileNumber: customer.mobileNumber,
      address: {
        street: customer.address.street || 'Unknown',
        area: customer.address.area||'Unknown',
        state: customer.address.state||'Unknown',
        country:customer.address.country|| 'Unknown',
        pincode:customer.address.pincode|| 'Unknown',
        city:customer.address.city|| 'Unknown',
        cityLowerCase:customer.address.cityLowerCase|| 'unKnown',
        longitude: 0,
        latitude: 0
      },
      token: '',
      profilePicUrl: '',
      createdDate: new Date().getTime(),
      alternativeMobileNumber: '',
      gstCertificateUrl: '',
      shopUrl: '',
      registrationDocumentUrl: '',
      photoIdUrl: '',
      representativeName: '',
      representativeMobileNumber: '',
      businessTagStatus: 'Counter-Sale-Customer',
      authId: `${customer.mobileNumber}@auth.com`,
      isRegistered: false,
      counterSaleInfo: {
        merchantId: merchantInfo.id
      }
    }

  }
  
  async getCustomerByMobileNumber(mobileNumber: string) {

    const searchFiled: string = "mobileNumber";
    const response = await this.firebaseService.getDataByFilters(`${DB_PATH.CUSTOMER}`, searchFiled, mobileNumber);

    return response && toCustomArray(response);
  }
}
