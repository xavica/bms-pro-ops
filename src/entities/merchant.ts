import { MerchantBusinessType } from './../common/enums';
import { IMerchantSalesPerson } from './../models/sales-person';
import { Address } from '.';
import { ICompany } from '../models/company';
import { VrsMerchantAPIKeys } from '../entities/vrs-merchant-keys'


export class Merchant {
    id: string = "";
    name: string = "";
    nameLowerCase: string = "";
    email: string = "";
    emailLowerCase: string = "";
    mobileNumber: string = "";
    isActive: boolean = false;
    isLive: boolean = false;
    companies: Array<ICompany> = [];
    salesPersons: Array<IMerchantSalesPerson> = [];
    businessTypeId: MerchantBusinessType;
    panNumber: string = "";
    gstNumber: string = "";
    businessName: string = "";
    address: Address = new Address();
    vrsMappingInfo: VrsMerchantAPIKeys = new VrsMerchantAPIKeys();
    password: string = "";
    inventoryMapping: InventoryReference = new InventoryReference();
}
export class InventoryReference {
    vendorId: string = "";
    vendorName: string = ""
}

export class Company {
    id: string = "";
    ref_id: string = "";
    name: string = "";
    isSelected: boolean = false;
}



export class MerchantSearchFields {
    id: string;
    mobileNumber: string;
    nameLowerCase: string;
    city: string;
}

export class ICompanyFb {
    name: string;
    id: string;
}
export class CompanyVrs {
    title: string;
    company_id: string;
}
export class RedisEntity {
    id: string;
    name: string;
    businessName: string;
    imageUrl: string;
    businessTypeId: number;
}