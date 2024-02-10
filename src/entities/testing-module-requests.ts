export class BaseEntity {
    array_config: Array<any> = [];
}

export class ItemDetailsRequestEntity extends BaseEntity {
    companies: Array<any>;
}
export class Cart {
    item_code: string;
    quantity: number;
}
export class PlaceVrsOrderEntity extends BaseEntity {
    order_id: string;
    customer: CustomerForCart;
    sales_person_name: string;
    cart: Array<Cart>;
}
export class VRSCustomerOrderModel {
    internal_customer_id: string;
    customer_name: string;
    customer: string;
}
export class CustomerForCart {
    customer_name: string;
    customer: string;
    internal_customer_id: string;
}