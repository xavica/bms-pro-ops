export class Promotion {
    id: string;
    name: string;
    nameLowerCase: string;
    imageUrl: string;
    createdTimeStamp: string;
    createdDate: string;
    expireDateTimeStamp: number;
    expireDate: string;
    modifiedDateTimeStamp: number;
    modifiedDate: string;
    isActive: boolean = true;
    merchant: merchant = new merchant();
    info: info = new info();
    createdUser: createdUser = new createdUser();
    merchantId: string;
}

export class merchant {
    id: string = "";
    businessName: string = "";
    mobileNumber: string = "";
    merchantNameLowerCase: string = "";
}

export class info {
    static: boolean;
    brandId: string;
    brand: string;
    subCategory: string;
    itemId: string;
    item: string;
}

export class createdUser {
    id: string;
    name: string;
    roleTypeId: number;
}

export class IBrand {
    brand: string;
    brand_id: number;
    description: string;

}

export class ISubCategory {
    item_sub_category: string;

}
