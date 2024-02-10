import { FirebaseService } from "./firebase.service";
import { HttpClient } from "aurelia-fetch-client";
import { DataService } from "./data.service";
import { BaseConfig, IConfig } from "../common";
import { DB_PATH } from "../constants";

export class CommonService extends DataService {
  controller: string;
  constructor(
    httpClient: HttpClient,
    baseConfig: BaseConfig,
    firebaseService: FirebaseService
  ) {
    super(httpClient, baseConfig, firebaseService);
    this.controller = "";
  }

  async getPromotionsImages(distributorid: string) {
    const response = await this.firebaseService.getDataByFilters(DB_PATH.PROMOTIONS, 'distributorId', distributorid)
    return response;
  }

  async deletePromotion(promotion: any) {
    const dbPath: string = `${DB_PATH.PROMOTIONS}/${promotion.id}`;

    return this.firebaseService.delete(dbPath);
  }
}
