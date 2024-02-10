import { DB_PATH } from './../constants/db-path';
import { HttpClient } from "aurelia-fetch-client";
import { DataService } from "./data.service";
import { BaseConfig, toCustomArray, toCustomObject } from "../common";
import { FirebaseService } from "./firebase.service";
import {
    getAddCompaniesBaseUrl,
    getCompaniesBaseUrl,
    getCompanyLogoBaseUrl,
    updateCompanyLogoBaseUrl,
    uploadCompanyLogoBaseUrl
} from "../common/workflow-endpoints";
import { CompanyEntity } from '../entities/company';
import { DistributorAPIKeys } from '../entities';
import { QmsConfigInfo } from '../entities/vrs-merchant-keys';
interface ICompanyFb {
    name: string,
    id: string
}

export class CompanyService extends DataService {
    constructor(httpClient: HttpClient, baseConfig: BaseConfig, firebaseService: FirebaseService) {
        super(httpClient, baseConfig, firebaseService);
        this.config = baseConfig.current;
    }

    async getCompaniesFb() {
        const response = await this.firebaseService.getData(DB_PATH.COMPANIES);

        return response && toCustomArray(response).sort();
    }

    async getCompaniesPg() {
        try {
            let response = await this.get(`${this.config.apiCoreUrl}/company/get_all_companies`, undefined, undefined, true);

            return this.mapCompaniesPg(response)
        } catch (error) {
            console.log("Sql Order Service getUnregisteredCustomers Error :::", error);

            return [];
        }
    }

    async deleteCompanyInFb(companyId: string) {

        return this.firebaseService.delete(`${DB_PATH.COMPANIES}/${companyId}`)
    }
    async addCompanyInFb(company: CompanyEntity) {

        return this.firebaseService.insert(`${DB_PATH.COMPANIES}/${company.id}`, company);
    }

    async addCompanies(companies: any): Promise<any> {

        return this.post(`${getAddCompaniesBaseUrl(this.config.env)
            }`, companies, undefined, true, false);
    }

    async getCompanies(): Promise<any> {

        return this.get(`${getCompaniesBaseUrl(this.config.env)
            }`, undefined, undefined, true, false);
    }

    async updateCompanyLogoUrl(companyLogoObject: any): Promise<any> {
        companyLogoObject.company_logo_url = `${getCompanyLogoBaseUrl(this.config.env)
            }/${companyLogoObject.company_logo_url
            }`;

        return this.post(`${updateCompanyLogoBaseUrl(this.config.env)
            }`, companyLogoObject, undefined, true, false);
    }

    uploadLogoInDigitalOcean(fileName: string, file: any) {
        try {
            const fullUrl = `${uploadCompanyLogoBaseUrl(this.config.env)
                }/${fileName}`;

            return this.put(fullUrl, file, undefined);
        } catch (error) {

            throw error;
        }
    }

    async deleteMerchantCompanyInFb(merchantId: string, companyId: string) {
        try {
            const dbPath: string = `${DB_PATH.MERCHANT
                }/${merchantId}/companies/${companyId}`;
            await this.firebaseService.delete(dbPath);

        } catch (error) {
            console.log("Error While Deleting Companies :::", error);

        }

    }

    async addMerchantCompanyInFb(merchantId: string, companiesObj: any) {
        try {

            const dbPath: string = `${DB_PATH.MERCHANT}/${merchantId}/companies`;

            return this.firebaseService.update(dbPath, companiesObj); // put update why because if i use insert it is replacing previous companies

        } catch (error) {

            console.log("Error While Saving Companies :::", error);
        }
    }

    async getMerchantCompanyInFb(merchantId: string) {
        try {

            const dbPath: string = `${DB_PATH.MERCHANT}/${merchantId}/companies`;

            const response = await this.firebaseService.getData(dbPath);

            return response && toCustomArray(response)

        } catch (error) {

            console.log("Error While Getting Companies getMerchantCompanyInFb :::", error);

            return [];
        }
    }

    async saveCompaniesInVrs(distributorKeys: DistributorAPIKeys, companies: any) {
        try {
            console.log(distributorKeys, companies);
            const fullUrl: string = `${distributorKeys.apiUrl
                }/api/method/viwito.api.item_company.create_item_company`;

            const options: any = {
                Authorization: `token ${distributorKeys.apiKey}:${distributorKeys.apiSecret}`
            }
            const response = await this.post(fullUrl, companies, options, true, true);

            console.log("saveCompaniesInVrs response", response);

            return response;

        } catch (error) {

            return []
        }
    }

    async getCompaniesFromVrs(distributorKeys: DistributorAPIKeys) {
        try {
            const fullUrl: string = `${distributorKeys.apiUrl}/api/method/viwito.api.item_company.get_item_company_list `;

            const options: any = {
                Authorization: `token ${distributorKeys.apiKey}:${distributorKeys.apiSecret}`
            }
            const responce = await this.get(fullUrl, undefined, options, true, false);

            return this.mapCompaniesVrs(responce && responce.message);
        } catch (error) {

            console.log('ERP Company Service getCompaniesInVrs error ::: ', error);
            return []
        }
    }

    async addCompaniesInVrs(companies: any) {
        try {
            let qmsInfo: QmsConfigInfo = await this.getQmsConfig();
            const fullUrl: string = `${qmsInfo.apiUrl
                }/api/method/viwitoqms.api.item_company.create_item_company`;
            const options: any = {
                Authorization: `token ${qmsInfo.apiKey}:${qmsInfo.apiSecret}`
            }
            const response = await this.post(fullUrl, companies, options, true, true);

            return response;

        } catch (error) {
            console.log("Error While Adding Company in QMS:::", error);

            return []
        }
    }

    async getQmsConfig() {
        try {
            const dbPath: string = `${DB_PATH.CONFIGURATIONS}/${DB_PATH.QMSCONFIGINFO}`;
            const response = await this.firebaseService.getData(dbPath);

            return response;
        } catch (error) {
            console.log("Error While Getting Companies getMerchantCompanyInFb :::", error);

            return [];
        }
    }


    private mapCompaniesVrs(response: Array<any>) {

        return response.map((c) => {
            return {
                name: c.name,
                id: c.company_id
            }
        })
    }
    private mapCompaniesPg(response: Array<any>) {

        return response.map((c) => {
            return {
                name: c.name,
                id: c.ref_id
            }
        })
    }

}
