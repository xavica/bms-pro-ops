import { FirebaseService } from "./firebase.service";
import { inject } from "aurelia-framework";
import { VrsMerchantAPIKeys } from "../entities/vrs-merchant-keys";
import { HttpClient } from "aurelia-fetch-client";
import { BaseConfig } from "../common";
import { DataService } from "./data.service";
import { DB_PATH } from "../constants";
import { getServiceApiUrl } from "../common/workflow-endpoints";


@inject(HttpClient, BaseConfig, FirebaseService)
export class PromotionService extends DataService {
  controller: string;
  constructor(
    httpClient: HttpClient,
    baseConfig: BaseConfig,
    firebaseService: FirebaseService
  ) {
    super(httpClient, baseConfig, firebaseService);
    this.config = baseConfig.current;
    this.controller = "";
  }

  async promotionSearchFB(searchField: string, searchValue: string) {
    try {
      const promotions: Array<any> = [];
      searchField = searchField === "merchantNameLowerCase" ? 'merchant/merchantNameLowerCase' : 'merchant/mobileNumber';
      const response = await this.firebaseService.getDataByFilters(
        `${DB_PATH.PROMOTIONS}`,
        searchField,
        searchValue
      );
      for (var key in response) {
        promotions.push(response[key]);
      }
      return promotions || [];
    } catch (error) {
      console.log("promotionsSearchFb:::", error);

      throw error;
    }
  }

  async getBrands(vrsMerchantKeys: VrsMerchantAPIKeys) {
    try {
      const fullUrl: string = `${vrsMerchantKeys.apiUrl}/api/method/viwito.api.brand.brand_id`;
      const options: any = { Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}` };
      const response = await this.get(fullUrl, undefined, options, true, true);

      return response;
    } catch (error) {
      console.log("PromotionService getBrands", error);
    }
  }

  async getSubCategory(vrsMerchantKeys: VrsMerchantAPIKeys, brandId: string) {
    try {
      const fullUrl: string = `${vrsMerchantKeys.apiUrl}/api/method/viwito.api.item.item_sub_category?`;
      const options: any = { Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}` };
      const body: any = { brand_id: brandId };
      const response = await this.post(fullUrl, body, options, true, true);

      return response;
    } catch (error) {
      console.log("PromotionService getSubCategory", error);
    }
  }

  async getItems(vrsMerchantKeys: VrsMerchantAPIKeys, searchText: string) {
    try {
      const fullUrl: string = `${vrsMerchantKeys.apiUrl}/api/method/${vrsMerchantKeys.apiModules.viwito}.item.search_items?name=${searchText}`;
      const options: any = {
        Authorization: `token ${vrsMerchantKeys.apiKey}:${vrsMerchantKeys.apiSecret}`,
      };
      const response = await this.get(fullUrl, undefined, options, true, true);

      return response.message;
    } catch (error) {

      console.log("PromotionService getItems", error);
    }
  }

  async savePromotionInFB(promotion: any) {
    const dbPath: string = `${DB_PATH.PROMOTIONS}/${promotion.id}`;

    return this.firebaseService.insert(dbPath, promotion);
  }

  async updatePromotionInFb(updateObj: any) {
    const dbPath: string = `${DB_PATH.PROMOTIONS}/${updateObj.id}`;

    return this.firebaseService.update(dbPath, updateObj);
  }

  async downloadImageUrl(formData) {

    const url = `${getServiceApiUrl(this.config.env)}/Backend/PostFile`;
    const result = await this.sendData(url, formData);
    const downloadUrl = `${this.config.containerUrl}${result}.jpg`;
    return downloadUrl;
  }

  async sendData(url: string, formData: FormData): Promise<string> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const text = await response.text();
        return text;
      } else {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}
