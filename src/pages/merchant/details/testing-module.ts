import { CustomerService } from './../../../services/customer.service';
import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Merchant } from "../../../entities";
import { MerchantService } from "../../../services/merchant.service";
import { getOrderNumberGuid, uuidv4 } from '../../../common/utility';
import { VrsMerchantAPIKeys } from '../../../entities/vrs-merchant-keys';
import { VRSCustomerOrderModel } from '../../../entities/testing-module-requests';

@inject(Router, MerchantService, CustomerService)
export class TestingModule {
    merchant: Merchant = new Merchant();
    roleTypeId: number;

    vrsMerchantAPIKeys: VrsMerchantAPIKeys;
    products: Array<any> = [];
    customers: Array<VRSCustomerOrderModel> = [];
    salesPersons: Array<string> = [];

    customerLimitMin: number = 50;
    customerLimitMax: number = 51;
    productsMin: number = 1;
    productsMax: number = 5;
    orderList: Array<any> = [];
    deliveryDate: string;
    noOfOrdersRequired: number = 50;
    isLoader: boolean = false;
    constructor(private router: Router, private merchantService: MerchantService, private customerService: CustomerService) {

    }
    activate(model: Merchant) {
        Object.assign(this.merchant, model);
        this.vrsMerchantAPIKeys = this.merchant.vrsMappingInfo;
        this.isLoader = false;
    }

    backButton() {
        this.router.navigateBack();
    }

    async getProductsFromVrs() {
        try {
            const response = await this.merchantService.getProductsFromVrsApi(this.vrsMerchantAPIKeys, { companies: this.merchant.companies.map((c) => c.id), "array_config": [] });
            const products: Array<any> = response && [].concat.apply([], Object.keys(response.message).map((key) => response.message[key])) || [];

            return products || [];
        }
        catch (error) {
            console.log("Products From Erp:- ", error);
            return [];
        }
    }

    async getAllCustomers() {
        try {
            const response: Array<any> = await this.customerService.getAllCustomersFromErp(this.vrsMerchantAPIKeys);

            return response.map((c) => {
                return {
                    internal_customer_id: c.internal_customer_id,
                    customer_name: c.name,
                    customer: c.customer_name
                }
            })
        } catch (error) {

            return [];
        }
    }

    async getSalesPersons() {

        try {
            const response: Array<any> = await this.customerService.getAllSalesPersonsFromErp(this.vrsMerchantAPIKeys);

            return response.map((s) => s.name);
        } catch (error) {

            return [];
        }

    }

    async generateOrders() {

        // TODO add loaders
        this.orderList = [];
        try {
            if (this.products.length === 0) {
                this.products = await this.getProductsFromVrs();
                if (this.products.length === 0) {
                    swal("", "Products Not Found!", "warning");

                    return;
                }
            }
            if (this.deliveryDate === undefined) {
                swal("", "Please Select Delivery Date", "warning");

                return;
            }

            if (this.customers.length === 0) {
                this.customers = await this.getAllCustomers();
                if (this.customers.length < 45) {
                    await this.createCustomersInVrs();
                }

            }

            if (this.salesPersons.length === 0) {
                this.salesPersons = await this.getSalesPersons();
            }
            this.isLoader = true;
            const billable_products: Array<any> = this.products.filter((p) => p.is_billable == 1);// (Math.floor(Math.random() * 2))
            const non_billable_products: Array<any> = this.products.filter((p) => p.is_billable == 0);
            let products = [billable_products, non_billable_products];
            if (non_billable_products.length === 0) {
                products = [billable_products, billable_products];
            }
            for (let index = 0; index < this.noOfOrdersRequired; index++) {
                let randomIndex = (Math.floor(Math.random() * 2));
                const randomOrderObj = this.generateRandomOrder(products[randomIndex]);
                const orderResponse = await this.merchantService.placeOrderByVrsApi(this.vrsMerchantAPIKeys, randomOrderObj);
                if (orderResponse.message) {
                    this.orderList.push({ "orderId": randomOrderObj.order_id, "customerId": randomOrderObj.customer.internal_customer_id, "customerName": randomOrderObj.customer.customer_name, "cart": randomOrderObj.cart, "isOrderPlaced": "Yes" });
                } else {
                    this.orderList.push({ "orderId": randomOrderObj.order_id, "customerId": randomOrderObj.customer.internal_customer_id, "customerName": randomOrderObj.customer.customer_name, "cart": randomOrderObj.cart, "isOrderPlaced": "NO" });
                }
            }
            this.isLoader = false;
            swal("", "Success Orders Placed", "success");

        } catch (error) {
            this.isLoader = false;
            swal("", "Something Went Wrong!", "error");
            console.log(' Testing Module generateOrders Error ::: ', error);
        }
    }


    async createCustomersInVrs() {
        const reqCustomerCount: number = 50 - this.customers.length;

        for (let index = 0; index < reqCustomerCount; index++) {
            const customerToCreate = this.mapToVrsCustomer();
            const erpCustomerNewlyCreated = await this.customerService.createCustomerInErp(this.vrsMerchantAPIKeys, customerToCreate);
            if (erpCustomerNewlyCreated && erpCustomerNewlyCreated.message) {
                this.customers.push({
                    internal_customer_id: customerToCreate.customer_id,
                    customer_name: customerToCreate.customer_name,
                    customer: customerToCreate.customer_name
                })
            }

        }

    }

    private mapToVrsCustomer() {

        const customerName = `${this.randomCustomerNames(Math.floor(Math.random() * 100) + 1)}-Index-${Math.floor(Math.random() * 100)}`;
        return {
            customer_name: customerName,
            customer_group: 'Kirana',
            customer_territory: 'Un_Known_Area',
            customer_id: uuidv4(),
            city: 'Un_Known_City',
            street: 'Un_Known_Street',
            country: 'INDIA',
            data: [{
                user_type_id: 1,
                photo_id_url: '',
                mobile_no: Math.floor(Math.random() * 10000000000),
                business_name: customerName,
                is_active: true,
                emial_id: '',
                area: 'Un_Known_Area',
                area_code: 'Un_Known_Area',
                pin_code: 500085,
                latitude: 0,
                id: 'Un_Known_Area',
                state: 'Un_Known_State',
                longitude: 0,
                gst_certificate_url: '',
                business_type_id: 2,
                gst_number: '',
                business_type: 'Kirana',
                business_tag_status: '',
                representative_name: '',
                alternative_mobile_number: '',
                is_must_pay: false,
                representative_mobile_number: '',
            }],
            array_config: []
        }
    }

    private generateRandomOrder(products: Array<any>) {
        const randomCustomer = this.customers[Math.floor(Math.random() * 50)];
        const randomSalesPerson = this.salesPersons[Math.floor(Math.random() * this.salesPersons.length)];
        const randomItems: Array<{ item_code: string, quantity: number }> = [];

        const noOfItemsRange: number = Math.floor(Math.random() * (+this.productsMax - +this.productsMin + 1)) + +this.productsMin;
        for (let index = 0; index < noOfItemsRange; index++) {
            const element = products[Math.floor(Math.random() * (products.length - 1))];
            randomItems.push({
                item_code: element.name,
                quantity: Math.floor(Math.random() * 30) + 1
            })
        }
        return {
            order_id: getOrderNumberGuid(),
            delivery_date: this.deliveryDate,
            cart: randomItems,
            customer: randomCustomer,
            sales_person_name: randomSalesPerson,
            is_billable: products[0].is_billable,
            array_config: []
        }
    }

    private randomCustomerNames(number: number) {
        return [
            "Laxmi narasimha medical",
            "A one bakery",
            "RAMESHKIRANA",
            "Sri Lakshmi kirana",
            "Balaji home needs",
            "Mahadev Kirana General store",
            "Mahadev kirana and general store",
            "Sree  food court",
            "SUDHAKAR KIRANA TIRPELLY HANUMAN TEMPLE",
            "SRI VENKATESHWARA REDDY SWEETS",
            "RAGAVENDRA KIRANAM NKD",
            "AMAN BAKERY SHANTI NAGAR",
            "Abhishek test",
            "SRI VEERADATHA",
            "CHLINGAIAH KIRANAM SKPT",
            "Mounika kirana and general store",
            "Ani's apna bazar",
            "Kirana",
            "Ramanand",
            "Prithiji kirana general Store",
            "Hanuman kiranam",
            "LAXMI KGS ALLADURGAM",
            "RAJESHWARIKIRANA",
            "Al madhina kgs",
            "Sri srinivasa kgs",
            "Vasudhan mart",
            "SS GENERAL STORE",
            "CDR BOYS HOSTEL",
            "AFFEEZ KHAN PAN SHOP MAIN ROAD",
            "ALI TRADERS GUNJ ROAD",
            "Milk",
            "Om sri vasavi traders",
            "Sridhar KGS",
            "Sri balaji ramdav kirana and general store",
            "Kalki kirana",
            "Sri venkateshwara dairy kirana",
            "New ganesh bangalore bakery",
            "Sri venkateshwar Traders",
            "Udayagiri kitchen",
            "PARMESHWAR PAN SHOP ASHOK ROAD",
            "Mahalakshmi kiranam",
            "TAJODDINKIRANA",
            "Sri bhavani kirana and general store ",
            "AMBEY KIRANA GENERAL STORES",
            "Business",
            "NewNational",
            "Sri balaji kirana and general store",
            "Abbas kirana store",
            "Srinu Kirana store",
            "Balaji kirana Store",
            "SRI ganesh kirana store",
            " GAYATRI Trader ",
            "Krishna kirana",
            "Slv hostel",
            "Hari hara mens hostel",
            "New pavan kgs",
            "VISHALKIRANAM",
            "Mahalaxmi kirana and general Store",
            "Drip drop",
            "Iqra kgs",
            "SRI SAI SAKTH MEDICAL",
            "JAYA LAXMI KIRANAM AND GENERAL STORE",
            "MADINA CONFECTIONARY GUNJ ROAD",
            "Appam surender kirana",
            "AJAYKUMARKIRANA",
            "New kesariya kirana general Store",
            "Delivery boy",
            "AR Kirana",
            "",
            "Om kirana",
            "Akshay kirana",
            "MM Medical hall ",
            "ASHOKE RICE OIL  AND DESIPOSABLE STORE",
            "RAMAVTAR KIRANA ASHOK ROAD",
            "SRI VEERABHADRA KGS",
            "V nagabushanam kirana and general stores",
            "Dharamdas enterprise",
            "SRI DLR New Mens hostel",
            "M PENTAIAH KIRANAM KODPAK",
            "Svp",
            "Ak pan shop",
            "Sree srinivasa kirana",
            "Nitesh Kumar kgs",
            "Haritha kirana Store",
            "Balaji kgs",
            "Sei Ragavendra hot Chips",
            "Sri srinivasa agencies",
            "Sri dhurgaa",
            "Kirana",
            "Shree traders",
            "Manorama Boys Hostel",
            "SRI SAI KIRANAM TEKMAL",
            "RAMAKRISHNA KGS",
            "Vijay Reddy Boys Hostel",
            "SRI RAJESWAR GENERAL STORE",
            "Saleem traders",
            "Nagajyoti",
            "SRI RAJA RAJESWARI SUPER MARKET",
            "Bavani kgs",
            "sri vinayaka womens hostel"
        ][number]
    }
}

