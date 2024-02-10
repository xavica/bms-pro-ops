import { Merchant } from './../entities/merchant';
import { MerchantBusinessType, UserType, CustomerRegistrationSource, BusinessType } from './../common/enums';
import { Customer, SalesAidInfo } from './../entities/customer';
import { DB_PATH } from './../constants/db-path';
import { VrsMerchantAPIKeys } from '../entities/vrs-merchant-keys';
import { FirebaseService } from './firebase.service';
import { HttpClient } from 'aurelia-fetch-client';
import { DataService } from './data.service';
import { BaseConfig, toCustomArray } from '../common';
import { IMerchantSalesPerson } from '../models/sales-person';

export class SalesPersonService extends DataService {
  controller: string;
  constructor(
    httpClient: HttpClient,
    baseConfig: BaseConfig,
    firebaseService: FirebaseService,
  ) {
    super(httpClient, baseConfig, firebaseService);
    this.controller = '';
  }

  async getSalesPersonVrs(salesPersonId: string, vrsMerchantKeys: VrsMerchantAPIKeys) {

    try {

      // TODO need to write api to get sales Person
      const fullUrl: string = `${vrsMerchantKeys.apiUrl
        }/api/method/viwito.api.sales_person.get_sales_person?internal_id=${salesPersonId}`;

      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
      }
      const response = await this.get(fullUrl, undefined, options, true, true);

      console.log("insertSalesPersonVrs response", response);

      // todo return SalesPerson Vrs Id
      return response;

    } catch (error) {

      throw error;
    }
  }

  async deactivateSalesPersonVRS(salesPersonId: string, vrsMerchantKeys: VrsMerchantAPIKeys) {

    try {

      // TODO need to write api to get sales Person
      const fullUrl: string = `${vrsMerchantKeys.apiUrl
        }/api/method/viwito.api.sales_person.is_active_sales_person?internal_id=${salesPersonId}`;

      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
      }
      const body: any = { internal_id: salesPersonId };

      const response = await this.post(fullUrl, body, options, true, true);

      console.log("insertSalesPersonVrs response", response);

      // todo return SalesPerson Vrs Id
      return response;

    } catch (error) {

      throw error;
    }
  }

  async insertSalesPersonVrs(salesPerson: { sales_person_name: string, short_code: string, internal_id: string } | any, vrsMerchantKeys: VrsMerchantAPIKeys) {

    try {

      const fullUrl: string = `${vrsMerchantKeys.apiUrl}/api/method/viwito.api.sales_person.create_sales_person`;

      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
      }
      const response = await this.post(fullUrl, salesPerson, options, true, true);

      console.log("insertSalesPersonVrs response", response);

      // todo return SalesPerson Vrs Id
      return response && response.message;

    } catch (error) {

      console.log(`Sales Person Service insertSalesPersonVrs Error ::: `, error);

      swal("", "Please fill the valid Details.", "warning");

      throw new Error(JSON.stringify(error))
    }
  }

  async getMerchantSalesPersonFB(merchantId: string) {
    const response = await this.firebaseService.getData(`${DB_PATH.MERCHANT}/${merchantId}/salesPersons`);

    return response && toCustomArray(response);
  }

  async salesPersonSearchFB(searchFiled: string, searchValue: string) {
    try {
      const response = await this.firebaseService.getDataByFilters(`${DB_PATH.CUSTOMER}`, searchFiled, searchValue);
      const salesPerson: Array<any> = [];
      for (var key in response) {
        salesPerson.push(response[key]);
      }

      return salesPerson || []
    } catch (error) {
      console.log("salesPersonSearchFB:::", error);

      throw error;
    }
  }

  async salesPersonByMobileNumber(mobileNumber: string) {

    const response = await this.salesPersonSearchFB('mobileNumber', mobileNumber);

    return this.mapSalesPerson(response && response[0]);
  }


  // To Add New Sales Person and tag to distributor
  /**
   * 
   * @param salesPerson
   * @param merchant { id: string, name: string, type: MerchantBusinessType }
   * @param vrsMerchantKeys VrsMerchantAPIKeys | null
   */
  async createSalesPerson(salesPerson: { mobileNumber: string, name: string },
    merchant: { id: string, name: string, type: MerchantBusinessType },
    vrsMerchantKeys: VrsMerchantAPIKeys | null = null) {
    try {

      // map salesPerson to customer for saving in firebase
      const salesPersonToInsert = this.mapToCreateSalesPerson(salesPerson);
      const authPassWord: string = `@${salesPersonToInsert.authId.slice(0, 4)}*${salesPersonToInsert.mobileNumber.slice(-5)}`;
      // Add customer in Firebase Auth

      const createSalesPersonAuthResponse = await this.firebaseService.createUserWithEmailAndPassword(salesPersonToInsert.authId, authPassWord);
      salesPersonToInsert.id = createSalesPersonAuthResponse && createSalesPersonAuthResponse.uid;
      // Add customer in firebase
      await this.firebaseService.insert(`${DB_PATH.CUSTOMER}/${salesPersonToInsert.id}`, salesPersonToInsert);
      const salesPersonToSave = { id: salesPersonToInsert.id, name: salesPersonToInsert.name, mobileNumber: salesPersonToInsert.mobileNumber };
      if (merchant.type !== MerchantBusinessType.Manufacturer && vrsMerchantKeys) {
        await this.addSalesPersonToDistributor(salesPersonToSave, merchant.id, vrsMerchantKeys);
      } else if (merchant.type === MerchantBusinessType.Manufacturer) {
        await this.addSalesPersonToManufacture(salesPersonToSave.id, salesPersonToSave.name, salesPersonToSave.mobileNumber, merchant);
      }

    } catch (error) {
      // if got error need to delete

      console.log(`Sales Person Service createSalesPerson error ::: `, error);
    }

  }

  // To Add Sales Person to Distributor
  /**
   * 
   * @param salesPerson 
   * @param distributorId 
   * @param vrsMerchantKeys 
   */
  async addSalesPersonToDistributor(salesPerson: { id: string, mobileNumber: string, name: string }, distributorId: string,
    vrsMerchantKeys: VrsMerchantAPIKeys) {
    try {

      const shotCode: string = salesPerson.name.slice(0, 5);
      const vrsSalesPerson = { sales_person_name: salesPerson.name, short_code: shotCode, internal_id: salesPerson.id }

      const vrsId = await this.insertSalesPersonVrs(vrsSalesPerson, vrsMerchantKeys);

      // Add in sales person firebase
      await this.firebaseService.update(`${DB_PATH.CUSTOMER}/${salesPerson.id}/salesAidInfo`, {
        vendorId: distributorId,
        erpSalesPersonId: vrsId,
        type: MerchantBusinessType.Distributor
      });

      // Add in Sales Person in Merchant Firebase node
      const merchantSalesPerson: IMerchantSalesPerson | any = this.mapToMerchantSalesPerson(salesPerson.id, salesPerson.name, salesPerson.mobileNumber, vrsId);
      await this.firebaseService.update(`${DB_PATH.MERCHANT}/${distributorId}/salesPersons/${merchantSalesPerson.id}`, merchantSalesPerson)

    } catch (error) {

      console.log(' Sales Person Service addSalesPersonToDistributor Error ::: ', error)
      throw error;
    }
  }

  // To Add Sales Person to Manufacture
  async addSalesPersonToManufacture(salesPersonId: string, name: string, mobileNumber: string, manufacture: { id: string, name: string, type: MerchantBusinessType },) {
    const merchantSalesPerson: IMerchantSalesPerson | any = this.mapToMerchantSalesPerson(salesPersonId, name, mobileNumber, '');

    const manufactureSalesPerson: any = {
      type: manufacture.type,
      manufacture: {
        id: manufacture.id,
        name: manufacture.name,
      },
    }
    // Add to Customer Node
    await this.firebaseService.update(`${DB_PATH.CUSTOMER}/${salesPersonId}/salesAidInfo`, manufactureSalesPerson);

    // Add in Merchant Node
    await this.firebaseService.update(`${DB_PATH.MERCHANT}/${manufacture.id}/salesPersons/${merchantSalesPerson.id}`, merchantSalesPerson)
  }

  // To Tag Distributor to Manufacture SalesPerson
  async addDistributorToManufactureSalesPerson(salesPerson: { id: string, name: string, mobileNumber: string }, distributorId: string, manufacture: { id: string, name: string }) {
    try {

      // Add SalesPerson to Vrs Site of Distributor;
      const distributor: Merchant = await this.firebaseService.getData(`${DB_PATH.MERCHANT}/${distributorId}`);
      const vrsApiKeys: VrsMerchantAPIKeys = distributor.vrsMappingInfo;
      const shotCode: string = `${manufacture.name.slice(0, 5)}_${salesPerson.name.slice(0, 5)}`
      const vrsSalesPerson = { sales_person_name: salesPerson.name, short_code: shotCode, internal_id: salesPerson.id }
      const vrsId: string = await this.insertSalesPersonVrs(vrsSalesPerson, vrsApiKeys);

      // Add Distributor Details to Sales Person Node in Sales Aid info
      await this.firebaseService.update(`${DB_PATH.CUSTOMER}/${salesPerson.id}/salesAidInfo/manufacture/distributors/${distributorId}`, {
        id: distributor.id, name: distributor.businessName, vrsId
      })

      // Add Distributor Details in Merchant Sales Person info node
      await this.firebaseService.update(`${DB_PATH.MERCHANT}/${manufacture.id}/salesPersons/${salesPerson.id}`, {
        id: salesPerson.id,
        mobilenumber: salesPerson.mobileNumber,
        name: salesPerson.name,
      })


      // To Update distributor in Manufacture node - TODO have to refactor
      await this.firebaseService.update(`${DB_PATH.MERCHANT}/${manufacture.id}/salesPersons/${salesPerson.id}/distributors/${distributor.id}`, {
        id: distributor.id, name: distributor.businessName, vrsId
      })
    } catch (error) {
      console.log(`Sales Person Service addMerchantToManufactureSalesPerson Error ::: `, error);

      throw error;
    }

  }

  async deleteDistributorSalesPerson(salesPersonId: string, distributorId: string, vrsApiKeys: VrsMerchantAPIKeys) {
    try {
      await this.deactivateSalesPersonVRS(salesPersonId, vrsApiKeys);

      // Delete in Customer Node
      await this.firebaseService.insert(`${DB_PATH.CUSTOMER}/${salesPersonId}/salesAidInfo`, null);

      await this.firebaseService.insert(`${DB_PATH.MERCHANT}/${distributorId}/salesPersons/${salesPersonId}`, null);

    } catch (error) {
      console.log(` Sales Person Service deleteDistributorSalesPerson error ::: `, error);

      throw error;
    }

  }

  async deleteManufactureSalesPerson(salesPersonId: string, manufactureId: string, distributorIdList: Array<string>) {
    try {
      for (const distributorId of distributorIdList) {
        const distributor: Merchant = await this.firebaseService.getData(`${DB_PATH.MERCHANT}/${distributorId}`);
        const vrsApiKeys: VrsMerchantAPIKeys = distributor.vrsMappingInfo;

        await this.deactivateSalesPersonVRS(salesPersonId, vrsApiKeys);
      }

      // Delete in Customer Node
      await this.firebaseService.delete(`${DB_PATH.CUSTOMER}/${salesPersonId}/salesAidInfo`);
      await this.firebaseService.delete(`${DB_PATH.MERCHANT}/${manufactureId}/salesPersons/${salesPersonId}`);

    } catch (error) {

      console.log(`Sales Person Service deleteManufactureSalesPerson Error :::  `, error);
      throw error;
    }

  }

  async deleteDistributorFromManufactureSalesPerson(salesPersonId: string, manufactureId: string, distributorId: string) {

    try {
      const distributor: Merchant = await this.firebaseService.getData(`${DB_PATH.MERCHANT}/${distributorId}`);

      const vrsApiKeys: VrsMerchantAPIKeys = distributor.vrsMappingInfo;

      await this.deactivateSalesPersonVRS(salesPersonId, vrsApiKeys);

      // Delete in Customer Node
      await this.firebaseService.delete(`${DB_PATH.CUSTOMER}/${salesPersonId}/salesAidInfo/manufacture/distributors/${distributorId}`);

      await this.firebaseService.delete(`${DB_PATH.MERCHANT}/${manufactureId}/salesPersons/${salesPersonId}/distributors/${distributorId}`);

    } catch (error) {
      console.log(` Sales Person Service deleteDistributorSalesPerson error ::: `, error);

      throw error;
    }
  }


  //#region private methods

  private mapSalesPerson(response: Customer) {

    if (response == null) {

      return null;
    }

    return {
      id: response.id,
      mobileNumber: response.mobileNumber,
      name: response.name,
      userTypeId: response.userTypeId,
      isActive: response.isActive,
      salesAidInfo: response.salesAidInfo,
      enableAddButton: response.userTypeId === UserType.SalesPerson && (!response.salesAidInfo)
    }

  }

  private mapToCreateSalesPerson(salesPerson: { mobileNumber: string, name: string }) {

    return {
      id: '',
      isActive: true,
      source: CustomerRegistrationSource.CreatedByMerchant,
      businessType: 'Kirana',
      businessTypeId: BusinessType.Kirana,
      name: salesPerson.name.trim(),
      businessName: salesPerson.name.trim(),
      gstNumber: '',
      nameLowerCase: salesPerson.name.trim().toLowerCase(),
      userTypeId: UserType.SalesPerson,
      email: '',
      emailLowerCase: '',
      mobileNumber: salesPerson.mobileNumber,
      address: {
        street: '',
        area: '',
        state: '',
        country: '',
        pincode: '',
        city: '',
        cityLowerCase: '',
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
      businessTagStatus: 'Distributor-sales',
      authId: `${salesPerson.mobileNumber}@auth.com`,
      isRegistered: false
    }

  }

  private mapToMerchantSalesPerson(id: string, name: string, mobileNumber: string, vrsId: string) {

    return {
      erpSalesPersonId: vrsId,
      id: id,
      mobilenumber: mobileNumber,
      name: name
    }
  }
  //#endregion
}
