import { Merchant } from './../entities/merchant';
import { MerchantBusinessType } from './../common/enums';
import { FirebaseService } from './firebase.service';
import { inject } from 'aurelia-framework';
import { DB_PATH } from '../constants';
import { IMerchantSalesPerson } from '../models/sales-person';
import { toCustomArray } from '../common';

@inject(FirebaseService)
export class DistributorService {
  constructor(private firebaseService: FirebaseService,) { }

  async getDistributorsFromFirebase() {

    return this.firebaseService.getDataByFilters(`${DB_PATH.BMS_MERCHANT}`, "businessTypeId", MerchantBusinessType.Distributor);
  }

  async getDistributorByIdFB(id: string) {

    return this.firebaseService.getData(`${DB_PATH.BMS_MERCHANT}/${id}`);
  }


  async updateDistributorFB(id: string, updateObj: Object) {

    return this.firebaseService.update(`${DB_PATH.BMS_MERCHANT}/${id}`, updateObj)
  }



  async getManufactureDistributors(companyIds: Array<string>) {
    const reqDistributors: Array<Merchant> = [];
    const distributors = await this.getDistributorsFromFirebase();
    for (const key in distributors) {
      if (Object.prototype.hasOwnProperty.call(distributors, key)) {
        const distributor: Merchant = distributors[key];
        const distributorCompanies = toCustomArray(distributor.companies);
        if (this.checkDistributorCompanies(companyIds, distributorCompanies.map((c) => c.id)) && distributor.vrsMappingInfo) {
          reqDistributors.push(distributor);
        }
      }
    }

    return reqDistributors;
  }

  private checkDistributorCompanies(reqCompanyIds: Array<string>, distributorCompanyIds: Array<string>) {

    return reqCompanyIds.filter(value => distributorCompanyIds.includes(value)).length > 0;
  }
}
