import { FirebaseService } from './firebase.service';
import { HttpClient } from 'aurelia-fetch-client';
import { DataService } from './data.service';
import { BaseConfig } from '../common';
import { getCustomersByVendorGeoAreaUrl } from '../common/workflow-endpoints';
import { RedisEntity } from '../entities';

export class GeoService extends DataService {
  controller: string;
  constructor(httpClient: HttpClient, baseConfig: BaseConfig, firebaseService: FirebaseService) {
    super(httpClient, baseConfig, firebaseService);
    this.controller = '';
  }

  async saveGeoJson(merchantId: any, geoJson: any) {
    try {
      const fullUrl = `${this.config.geoUrl}/vendor/${merchantId}/upload`;

      return this.post(fullUrl, geoJson);
    } catch (error) {

      throw error;
    }
  }

  async mapCompanies(companiesList: any) {
    const fullUrl: string = `${this.config.geoUrl}/location/map_companies`;
    const locationCompaniesMapping: any = this.mapLCM(companiesList);

    return this.post(fullUrl, locationCompaniesMapping);
  }

  async unmapCompanies(companiesList: any) {
    try {
      const fullUrl = `${this.config.geoUrl}/location/map_companies`;
      const locationCompaniesMapping: any = this.mapLCM(companiesList);

      return this.destroy(fullUrl, locationCompaniesMapping);
    } catch (error) {

      throw error;
    }
  }

  async getLocations(merchantId: any) {
    try {
      const fullUrl = `${this.config.geoUrl}/vendor/${merchantId}/lcm`;
      let lcmObj = await this.get(fullUrl);
      let locationsDetails = lcmObj.data || [];

      return this.mapLocations(locationsDetails);
    } catch (error) {

      throw error;
    }
  }

  async getMerchantId(merchantRefId: any) {
    try {
      const fullUrl = `${this.config.geoUrl}/vendor/vid/${merchantRefId}`;
      let merchantObj = await this.get(fullUrl);
      let merchantId: any = merchantObj.data.vendorId;

      return merchantId;
    } catch (error) {

      throw error;
    }
  }

  async geoJsonByVendor(merchantId: any) {
    const fullUrl = `${this.config.geoUrl}/location/download/${merchantId}`;
    let geoJson = await this.get(fullUrl);

    return geoJson;
  }

  async locationGeoJson(locationId: any) {
    const fullUrl = `${this.config.geoUrl}/location/${locationId}/download`;
    let merchantId = await this.get(fullUrl);

    return merchantId;
  }

  async addVendor(merchantObj: { refId: string, name: string, mobileNumber: number, businessName: string } | any) {
    // const fullUrl = `${this.base.geoUrl}/vendor/`;
    const fullUrl = `${this.config.apiCoreUrl}/Vendor/`;

    return this.post(fullUrl, merchantObj);
  }

  async addVendorInRedis(merchantObj: RedisEntity | any) {
    const fullUrl = `${this.config.redisApiUrl}/vendors/create`;

    return this.post(fullUrl, merchantObj);
  }



  async updateLocation(locationId: any, vendorId: any, geoJson: any) {
    try {
      const fullUrl = `${this.config.geoUrl}/location/${vendorId}/${locationId}`;

      return this.post(fullUrl, geoJson, undefined, false);
    } catch (error) {

      throw error;
    }
  }

  async getCustomersByVendorGeoArea(vendorId: any) {
    try {
      let customers_by_vendor_geoarea_url = `${getCustomersByVendorGeoAreaUrl(this.config.env)}/${vendorId}`

      return await this.get(customers_by_vendor_geoarea_url);
    } catch (error) {

      throw error;
    }
  }

  //#region private methods

  private mapLocations(locations) {
    let formattedLocations: Array<any> = [];
    for (const location of locations) {
      if (location.locationName != "") {
        let locationName: string = location && location.locationName || "",
          locationId: number = location && location.locationId || 0,
          companyNames: Array<any> = [], companyIds: Array<any> = [];
        companyNames.push(location.companies.map((data) => data && data.companyName || ""));
        companyIds.push(location.companies.map((data) => data && data.companyRefId || ""));
        let reqObj = {
          locationId: locationId,
          locationName: locationName,
          companyNames: companyNames,
          companyIds: companyIds,
          strCompanies: JSON.stringify(companyNames)
        }
        formattedLocations.push(reqObj);
      }
    }
    return formattedLocations || [];
  }

  private mapLCM(companiesList: Array<any>) {
    return {
      "vendorId": companiesList[0].vendorId,
      "locationId": companiesList[0].locationId,
      "companies": companiesList.map((data) => data.id),
      "vendorTypeId": companiesList[0].vendorTypeId
    }
  }

  async searchMerchants(search: string) {
    const fullUrl = `${this.config.apiCoreUrl}/Vendor/search_vendor/${search}`
    const response = this.get(fullUrl);

    return response
  }

}
