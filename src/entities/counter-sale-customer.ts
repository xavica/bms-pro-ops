export class CounterSaleCustomer {
    customer_name: string;
    customer_group: string;
    customer_territory: string;
    customer_id: string;
    data: [{
        user_type_id: number;
        photo_id_url: string;
        mobile_no: string;
        business_name: string;
        is_active: boolean;
        emial_id: string;
        area: string;
        area_code: string;
        pin_code: string;
        latitude: number;
        id: string;
        state: string;
        longitude: number;
        gst_certificate_url: string;
        business_type_id: number;
        gst_number: string;
        business_type: string;
        business_tag_status: string;
        representative_name: string;
        alternative_mobile_number: string;
        is_must_pay: boolean;
        representative_mobile_number: string;
        is_gst_registered: number;

    }];
    city: string;
    street: string;
    country: string;
    array_config: Array<any>;
}