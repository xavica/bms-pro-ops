import { Customer } from './../../../entities/customer';
import { ApplicationState } from './../../../common/application-state';
import { CustomerService } from './../../../services/customer.service';
import { SalesPersonService } from './../../../services/sales-person.service';
import { Aurelia, inject } from 'aurelia-framework';
import { BusinessType, CustomerRegistrationSource, getSwalMessage, UserType } from '../../../common';
import { Merchant } from '../../../entities/merchant';
import { VrsMerchantAPIKeys } from '../../../entities/vrs-merchant-keys';
import { MerchantService } from '../../../services';
import { CounterSaleCustomer } from '../../../entities/counter-sale-customer';

@inject(MerchantService, SalesPersonService, CustomerService, ApplicationState)

export class MerchantVrsConfiguration {
  merchant: Merchant = new Merchant();
  vrsMappingInfo: VrsMerchantAPIKeys = new VrsMerchantAPIKeys();
  showVrsConfigInfo: boolean = false;
  showCreateVrsConfigInfo: boolean = false;
  merchantNonEdit: VrsMerchantAPIKeys = new VrsMerchantAPIKeys();
  merchantEdited: Merchant = new Merchant();
  inventoryVendorReference: Array<any> = [];
  isJitVendor: boolean = false;
  selectedInventoryVendor: { id: string, name: string };
  isLoading: boolean = false;


  constructor(
    private merchantService: MerchantService,
    private salesPersonService: SalesPersonService,
    private customerService: CustomerService,
    private appState: ApplicationState
  ) { }
  async activate(modal: Merchant) {
    //this.merchant = modal;
    this.merchant.id = modal.id;
    this.merchant.businessTypeId = modal.businessTypeId;
    this.merchantNonEdit = modal.vrsMappingInfo;

    Object.assign(this.merchant.vrsMappingInfo, modal.vrsMappingInfo);
    if (this.merchant.vrsMappingInfo && this.merchant.vrsMappingInfo.apiUrl && this.merchant.vrsMappingInfo.apiUrl.length > 0) {
      this.vrsMappingInfo = this.merchant.vrsMappingInfo;
      this.showCreateVrsConfigInfo = true;
      if (this.merchant.businessTypeId == 4) {
        this.inventoryVendorReference = await this.merchantService.merchantSearchFB('businessTypeId', 5);
        this.isJitVendor = true;
        console.log("searchResultForDuplicateMobileNumber -------------", this.inventoryVendorReference);
      }
    }


  }
  mapToUpdateCustomer(customerId: string, merchant: Merchant) {
    return {
      id: customerId,
      source: CustomerRegistrationSource.CreatedForCounterSale,
      businessType: 'Kirana',
      businessTypeId: BusinessType.Kirana,
      name: 'Counter Sale',
      businessName: 'Counter Sale',
      gstNumber: merchant.gstNumber || '',
      nameLowerCase: 'counter sale',
      userTypeId: UserType.CounterSaleCustomer,
      email: merchant.email || '',
      emailLowerCase: merchant.emailLowerCase || '',
      address: {
        street: merchant.address.street || 'Unknown',
        area: merchant.address.area || 'Unknown',
        state: merchant.address.state || 'Unknown',
        country: merchant.address.country || 'Unknown',
        pincode: merchant.address.pincode || 'Unknown',
        city: merchant.address.city || 'Unknown',
        cityLowerCase: merchant.address.cityLowerCase || 'unKnown',
        longitude: 0,
        latitude: 0
      },
      createdDate: new Date().getTime(),
      businessTagStatus: 'Counter-Sale-Customer',
      counterSaleInfo: {
        merchantId: merchant.id,
      }
    }
  }
  async saveVrsMappingInfo() {
    try {

      if (!this.validateVendorDetails()) {
        swal("", "Please fill the Mandatory Fields", "warning");

        return;
      }

      const vrsMappingInfo: VrsMerchantAPIKeys = this.fillVendor(this.vrsMappingInfo);

      // Get Merchat based on api url
      const merchantsWithSameApiUrlResponse: Array<Merchant> = await this.merchantService.getMerchantByVrsApiUrl(vrsMappingInfo.apiUrl);
      const merchantsWithSameApiUrl: Array<Merchant> = merchantsWithSameApiUrlResponse && merchantsWithSameApiUrlResponse.filter((m) => m.id != this.merchant.id);

      if (merchantsWithSameApiUrl && merchantsWithSameApiUrl.length > 0) {

        swal("", "Vrs Site is already mapped to another merchant.", "warning");

        return;
      }
      const resetMessage: any = getSwalMessage(`Add Vrs Mapping Info`, "Do you wish to Save the Modified changes for this Merchant.Do you wish to continue..?", "warning")

      swal(resetMessage, async () => {
        // add Self sales Person
        // API Configuration;
        const selfSalesPerson = {
          internal_id: this.merchant.id,
          sales_person_name: "Self Order",
          short_code: `selfOrder`,
          is_self_sales_person: true,
        }
        const response = await this.salesPersonService.insertSalesPersonVrs(selfSalesPerson, vrsMappingInfo);
        let merchant = this.appState.merchant
        let mobileNumber = this.appState.merchant.mobileNumber
        let merchantName = this.appState.merchant.name;
        const merchantInfo = {
          mobileNumber: this.appState.merchant.mobileNumber,
          name: this.appState.merchant.name,
          id: this.appState.merchant.id
        }
        const createCustomerResponseFb = await this.customerService.getCustomerByMobileNumber(mobileNumber);
        const customerId: string = createCustomerResponseFb && createCustomerResponseFb[0].id || '';
        if (customerId == '') {
          await this.customerService.createCounterSaleCustomer(merchant, merchantInfo);
        }
        else {
          const customerObj = this.mapToUpdateCustomer(customerId, merchant);
          await this.customerService.updateCustomerFB(customerId, customerObj);
        }

        //create counter sale customer in firebase
        let counterSaleCustomerResponse = createCustomerResponseFb
        const createCustomerResponseVrs = await this.customerService.getCustomerVrs(counterSaleCustomerResponse[0].id, vrsMappingInfo);
        if (createCustomerResponseVrs == 0) {
          //create counter sale customer in Vrs
          const vrsCounterSaleCustomer: CounterSaleCustomer = {
            customer_name: 'Counter Sale',
            customer_group: 'Kirana',
            customer_territory: merchant.address.area || 'Un_Known_Area',
            customer_id: counterSaleCustomerResponse[0].id,

            data: [{
              user_type_id: 8,
              photo_id_url: '',
              mobile_no: merchant.mobileNumber,
              business_name: 'Counter Sale',
              is_active: merchant.isActive,
              emial_id: merchant.email || '',
              area: merchant.address.area,
              area_code: merchant.address.areaCode || '',
              pin_code: merchant.address.pincode,
              latitude: merchant.address.latitude,
              id: merchant.address.area || '',
              state: merchant.address.state,
              longitude: merchant.address.longitude,
              gst_certificate_url: '',
              business_type_id: merchant.businessTypeId,
              gst_number: merchant.gstNumber || '',
              business_type: 'Kirana',
              business_tag_status: '',
              representative_name: '',
              alternative_mobile_number: '',
              is_must_pay: false,
              representative_mobile_number: '',
              is_gst_registered: merchant.gstNumber.length ? 1 : 0,

            }],
            city: merchant.address.city || 'Un_Known_City',
            street: merchant.address.street || 'Un_Known_Street',
            country: merchant.address.country || 'INDIA',
            array_config: []
          }
          const vrsResponse = await this.customerService.insertCustomerVrs(vrsCounterSaleCustomer, vrsMappingInfo);
        }

        vrsMappingInfo.selfSalesPersonId = response;
        // TODO add api configuration
        await this.merchantService.updateVrsMappingFB(this.merchant.id, vrsMappingInfo);

        swal("", "Configuration Details Updated", "success");

        this.merchant = await this.merchantService.getUser(this.merchant.id);
        this.merchantNonEdit = this.merchant.vrsMappingInfo;
        this.showCreateVrsConfigInfo = true;

      });

    } catch (error) {

      console.log(' Vrs Configuration saveVrsMappingInfo Error ', error);

      swal("", "Not Valid Vrs Configuration", "error");
    }
  }

  fillVendor(vrsMappingInfo: VrsMerchantAPIKeys) {
    let apiModules = {
      qwipo: "qwipo.api",
      viwito: "viwito.api",

    }

    return {
      apiUrl: vrsMappingInfo.apiUrl || "",
      apiKey: vrsMappingInfo.apiKey || "",
      apiSecret: vrsMappingInfo.apiSecret || "",
      selfSalesPersonId: vrsMappingInfo.selfSalesPersonId || "",
      apiModules: apiModules || "",

    };
  }

  validateVendorDetails() {
    this.removeSpaces();
    let status = true;
    let message = "";
    if (!this.vrsMappingInfo.apiKey || !this.vrsMappingInfo.apiSecret || !this.vrsMappingInfo.apiUrl) {
      message = "Please fill the Mandatory Fields";
      status = false;
    } else { }
    if (!status) {
      let resetMessage: any = {
        title: "Warning",
        text: message,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#13BB6F",
        confirmButtonText: "Ok",
        closeOnConfirm: true
      };
      swal(resetMessage, () => {
        return;
      });
    }
    return status;
  }

  addErpSettings() {

    this.showVrsConfigInfo = true;
  }

  private removeSpaces() {
    this.vrsMappingInfo.apiKey = this.vrsMappingInfo.apiKey.trim();
    this.vrsMappingInfo.apiUrl = this.vrsMappingInfo.apiUrl.trim();
    this.vrsMappingInfo.apiSecret = this.vrsMappingInfo.apiSecret.trim();

  }


  tagInventoryVendorInJit() {
    this.saveInventoryDetailsInJit();
  }


  async saveInventoryDetailsInJit() {
    try {
      this.isLoading = true;
      const createCustomerResponseVrs = await this.customerService.getCustomerVrs(this.merchant.id, this.merchant.vrsMappingInfo);

      if (createCustomerResponseVrs == 0) {
        const inventoryVendorInfo = this.mapInventoryCustomerInVrs(this.selectedInventoryVendor);

        await this.customerService.insertCustomerVrs(inventoryVendorInfo, this.merchant.vrsMappingInfo);

        const inventoryMapping = {
          vendorId: this.selectedInventoryVendor.id,
          vendorName: this.selectedInventoryVendor.name
        };

        await this.merchantService.updateInventoryMappingFB(this.merchant.id, inventoryMapping);

        swal("", "Vendor Tagged Successfully", "success");
      } else {
        swal("", "This Customer Is Already Tagged", "success");
      }
    } catch (error) {
      console.error(error);
      swal("", "Something went wrong", "error");
      this.isLoading = false;

    } finally {
      this.isLoading = false;
    }
  }


  private mapInventoryCustomerInVrs(merchant) {

    const vrsCounterSaleCustomer: CounterSaleCustomer = {
      customer_name: merchant.name,
      customer_group: 'Kirana',
      customer_territory: merchant.address.area || 'Un_Known_Area',
      customer_id: merchant.id,

      data: [{
        user_type_id: 8,
        photo_id_url: '',
        mobile_no: merchant.mobileNumber,
        business_name: merchant.name,
        is_active: merchant.isActive,
        emial_id: merchant.email || '',
        area: merchant.address.area,
        area_code: merchant.address.areaCode || '',
        pin_code: merchant.address.pincode,
        latitude: merchant.address.latitude,
        id: merchant.address.area || '',
        state: merchant.address.state,
        longitude: merchant.address.longitude,
        gst_certificate_url: '',
        business_type_id: merchant.businessTypeId,
        gst_number: merchant.gstNumber || '',
        business_type: merchant.BusinessType,
        business_tag_status: '',
        representative_name: '',
        alternative_mobile_number: '',
        is_must_pay: false,
        representative_mobile_number: '',
        is_gst_registered: 1,//need some clearity on this

      }],
      city: merchant.address.city || 'Un_Known_City',
      street: merchant.address.street || 'Un_Known_Street',
      country: merchant.address.country || 'INDIA',
      array_config: []
    }

    return vrsCounterSaleCustomer;

  }


}