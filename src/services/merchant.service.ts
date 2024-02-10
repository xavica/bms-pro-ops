import { Merchant } from './../entities/merchant';
import { FirebaseService } from "./firebase.service";
import { inject } from "aurelia-framework";
import { DB_PATH } from "../constants";
import { BaseConfig, toCustomArray, toCustomObject } from '../common';
import { VrsMerchantAPIKeys } from '../entities/vrs-merchant-keys';
import { HttpClient } from 'aurelia-fetch-client';
import { DataService } from './data.service';
import {
  uploadMerchantLogoBaseUrl,
  getMerchantLogoBaseUrl
} from "../common/workflow-endpoints";

interface ICompanyFb {
  name: string,
  id: string
}

export class MerchantService extends DataService {
  firebaseService: FirebaseService;
  constructor(httpClient: HttpClient, baseConfig: BaseConfig, _firebaseService: FirebaseService) {
    super(httpClient, baseConfig, _firebaseService);
    this.firebaseService = _firebaseService;
  }




  async getUser(uid: string) {

    const response = await this.firebaseService.getData(`${DB_PATH.MERCHANT}/${uid}`);

    return this.mapMerchant(response);
  }

  async addMerchantToFireBase(merchantId: string, merchantObj: any = {}) {
    return this.firebaseService.insert(
      `${DB_PATH.MERCHANT}/${merchantId}`,
      merchantObj
    );
  }

  async logout(): Promise<any> {
    return this.firebaseService.logout();
  }
  checkUserLoggedIn(): Promise<any> {
    return this.firebaseService.checkUserLoggedIn();
  }

  createMerchant(email: string, passWord: string) {
    try {
      return this.firebaseService.createUserWithEmailAndPassword(
        email,
        passWord
      );
    } catch (error) {
      console.log("MerchantService createMerchant error", error);
    }
  }

  async merchantSearchFB(searchFiled: string, searchValue: any) {
    try {
      let filed =
        searchFiled === "city"
          ? "address/cityLowerCase"
          : searchFiled;

      const response = await this.firebaseService.getDataByFilters(
        `${DB_PATH.MERCHANT}`,
        filed,
        searchValue
      );
      const merchants: Array<any> = [];
      for (var key in response) {
        const mappedMerchant: Merchant = await this.mapMerchant(response[key]);
        merchants.push(mappedMerchant);
      }

      return merchants || [];
    } catch (error) {
      console.log("merchantsSearchFB:::", error);

      throw error;
    }
  }

  async getAllMerchantsFB() {
    try {

      const response = await this.firebaseService.getData(`${DB_PATH.MERCHANT}`);
      const merchants: Array<any> = [];
      for (var key in response) {
        const mappedMerchant: Merchant = await this.mapMerchant(response[key]);
        mappedMerchant['nameSearchKey'] = mappedMerchant.name.toLocaleLowerCase().replace(/\s/g, '');
        mappedMerchant['citySearchKey'] = mappedMerchant.address.city.toLocaleLowerCase().replace(/\s/g, '');

        merchants.push(mappedMerchant);
      }

      return merchants || [];
    } catch (error) {
      console.log("merchantsSearchFB:::", error);

      throw error;
    }
  }


  private async mapMerchant(merchantInDb: any) {

    if (Array.isArray(merchantInDb.companies)) {
      // make companies as Object and update in DB
      const companiesObj: Record<string, ICompanyFb> = toCustomObject(merchantInDb.companies);

      await this.firebaseService.delete(`${DB_PATH.MERCHANT}/${merchantInDb.id}/companies`);
      await this.firebaseService.update(`${DB_PATH.MERCHANT}/${merchantInDb.id}/companies`, companiesObj);

      return merchantInDb;
    }

    merchantInDb.companies = toCustomArray(merchantInDb.companies);
    merchantInDb.salesPersons = toCustomArray(merchantInDb.salesPersons);

    return merchantInDb;
  }

  async updateVrsMappingFB(id: string, updateObj: Object) {

    return this.firebaseService.update(`${DB_PATH.MERCHANT}/${id}/vrsMappingInfo`, updateObj)
  }

  async getMerchant(uid: string) {

    const response = await this.firebaseService.getData(`${DB_PATH.MERCHANT}/${uid}`);

    return response;
  }

  async getMerchantByVrsApiUrl(apiUrl: string) {

    const searchFiled: string = "vrsMappingInfo/apiUrl";
    const response = await this.firebaseService.getDataByFilters(`${DB_PATH.MERCHANT}`, searchFiled, apiUrl);

    return response && toCustomArray(response);
  }
  async getProductsFromVrsApi(vrsMerchantKeys: VrsMerchantAPIKeys, itemDetailsRequestEntity: any) {
    try {
      const fullUrl: string = `${vrsMerchantKeys.apiUrl}/api/method/viwito.api.company.get_item_details`;
      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
      }
      const response = await this.post(fullUrl, itemDetailsRequestEntity, options, true, true);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async placeOrderByVrsApi(vrsMerchantKeys: VrsMerchantAPIKeys, order: any) {
    try {
      const fullUrl: string = `${vrsMerchantKeys.apiUrl}/api/method/viwito.api.sales_order.make_sales_order`;
      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`
      }
      const response = await this.post(fullUrl, order, options, true, true);
      return response;
    } catch (error) {
      throw error;
    }
  }

  uploadLogoInDigitalOcean(fileName: string, file: any) {
    try {


      const fullUrl = `${uploadMerchantLogoBaseUrl(this.config.env)
        }/${fileName}`;

      return this.put(fullUrl, file, undefined);
    } catch (error) {

      throw error;
    }
  }
  unixTimestamp() {
    return Math.floor(Date.now() / 1000)
  }
  getMerchantLogoFromDigitalOcean(merchantId: string,) {
    try {
      let dateTime = this.unixTimestamp();

      return `${getMerchantLogoBaseUrl(this.config.env)}/${merchantId}.png?time=${dateTime}`;

    } catch (error) {
      console.log("error in getMerchantLogoFromDigitalOcean::::", error)
      throw error;
    }
  }

  async updateVendorInRedis(merchantObj: any) {
    const fullUrl = `${this.config.redisApiUrl}/api/vendors/update`;

    return this.post(fullUrl, merchantObj);
  }

  async updateInventoryMappingFB(id: string, updateObj: Object) {

    return this.firebaseService.update(`${DB_PATH.MERCHANT}/${id}/inventoryVendorReferenceInfo`, updateObj)
  }

}
