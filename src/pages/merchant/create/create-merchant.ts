import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { states, MerchantBusinessType, uuidv4, isValidName, isValidEmail, isValidMobileNumber, isValidAddress, isValidGstNumber, isValidPincode, BMSUserType } from '../../../common';
import { APP_ROUTES } from '../../../constants';
import { Merchant, Address, RedisEntity } from '../../../entities';
import { MerchantService, UserService } from '../../../services';

@inject(MerchantService, Router, UserService)
export class CreateMerchant {
  merchant: Merchant = new Merchant();
  isLoader: boolean = false;
  appSettings: any;
  states: Array<any> = states;
  merchantBusinessTypes: Array<number> = [MerchantBusinessType.Distributor, MerchantBusinessType.Manufacturer, MerchantBusinessType.Wholesaler, MerchantBusinessType.JitVendor];
  isLoading: boolean = false;

  constructor(
    private merchantService: MerchantService,
    private router: Router,
    private userService: UserService,
  ) {
  }

  async activate() {
  }


  async createUser() {
    try {
      if (this.merchantValidation()) {
        this.isLoading = true;

        //---------Duplicate mobile number and email validation-----------//
        const searchResultForDuplicateMobileNumber: Array<any> = await this.merchantService.merchantSearchFB('mobileNumber', this.merchant.mobileNumber);
        if (searchResultForDuplicateMobileNumber.length > 0) {
          swal('', "This Mobile Number is already registered with us!", 'warning');

          return;
        }
        const searchResultForDuplicateEmail: Array<any> = await this.merchantService.merchantSearchFB('email', this.merchant.email);
        if (searchResultForDuplicateEmail.length > 0) {
          swal('', "This Email is already registered with us!", 'warning');

          return;
        }
        //---------End duplicate mobile number and email validation-----------//

        const merchantMappedEntity = this.mapToMerchantEntity(this.merchant);



        const responseUid = await this.userService.createUserWithEmailAndPassword(merchantMappedEntity.email, merchantMappedEntity.password);

        this.merchant.id = responseUid.uid;

        if (this.merchant.id.length > 0) {
          merchantMappedEntity.id = this.merchant.id;  
          await this.merchantService.addMerchantToFireBase(this.merchant.id, merchantMappedEntity);

// Saving in the viiwto PG throught viwito core Api

          // if (this.merchant.businessTypeId !== MerchantBusinessType.Manufacturer) {
          //   const response = await this.geoService.addVendor({ refId: this.merchant.id, name: this.merchant.businessName, mobileNumber: this.merchant.mobileNumber, businessName: this.merchant.businessName });
          //   const redisEntity = this.mapRedisEntity(this.merchant);
          //   const res = await this.geoService.addVendorInRedis(redisEntity);
          // }
          this.isLoading = false;

          swal("", `Merchant Registered Successfully`, "success");


          this.router.navigateToRoute(APP_ROUTES.MERCHANT_SEARCH);
        } else {
          this.isLoading = false;
          swal("", `Something went Wrong`, "success");
        }
      }
    } catch (error) {

      this.isLoading = false;
      console.log("CreateMerchant createUser error", error);
      swal("", `Something Went Wrong`, "error");
    }
  }

  private mapToMerchantEntity(merchant: Merchant) {

    let address: Address = {
      street: merchant.address.street.trim() || "",
      area: merchant.address.area.trim() || "",
      state: merchant.address.state.trim() || "",
      country: merchant.address.country.trim() || "",
      pincode: merchant.address.pincode || "",
      city: merchant.address.city.trim() || "",
      cityLowerCase: merchant.address.city.toLowerCase().trim() || "",
      longitude: merchant.address.longitude || 0,
      latitude: merchant.address.latitude || 0
    };
    return {
      "id": merchant.id,
      "name": merchant.name,
      "nameLowerCase": merchant.name.toLowerCase(),
      "email": merchant.email.trim(),
      "businessName": merchant.businessName.trim(),
      "emailLowerCase": merchant.email.toLowerCase(),
      "mobileNumber": merchant.mobileNumber,
      "isActive": merchant.isActive,
      "isLive": merchant.isLive,
      "address": address || {},
      "companies": merchant.companies || [],
      "businessTypeId": merchant.businessTypeId,
      "gstNumber": merchant.gstNumber,
      "panNumber": merchant.panNumber,
      "password": merchant.password,
      "userType": BMSUserType.Vendor
    }
  }
  private mapRedisEntity(merchant) {
    const id = merchant.id;
    const result = {};
    result[id] = {
      id: id,
      name: merchant.name,
      businessName: merchant.businessName.trim(),
      businessTypeId: merchant.businessTypeId.toString(),
      imageUrl: "",
    };
    return result;
  }


  private merchantValidation() {
    if (!this.merchant.name.length || !this.merchant.businessTypeId || !this.merchant.businessName
      || !this.merchant.email || !this.merchant.mobileNumber || !this.merchant.address.area || !this.merchant.address.state ||
      !this.merchant.address.street || !this.merchant.address.city || !this.merchant.address.pincode || !this.merchant.password) {
      swal('', "Please fill all the fields", 'warning');
      return false;
    }
    else if (!isValidName(this.merchant.name)) {
      swal('', "Enter valid name", 'warning');
      return false;
    }
    else if (!isValidName(this.merchant.businessName)) {
      swal('', "Enter valid Business Name", 'warning');
      return false;
    } else if (!isValidEmail(this.merchant.email)) {
      swal('', "Enter valid email", 'warning');
      return false;
    } else if ((!isValidMobileNumber(this.merchant.mobileNumber))) {
      swal('', "Enter valid Mobile Number", 'warning');
      return false;
    }
    else if (!isValidAddress(this.merchant.address.city && this.merchant.address.area && this.merchant.address.city && this.merchant.address.state)) {
      swal('', "Enter valid Address", 'warning');
      return false;
    }
    else if (this.merchant.gstNumber == "undefined" || !isValidGstNumber(this.merchant.gstNumber.toUpperCase())) {
      swal('', "Enter valid GST number", 'warning');
      return false;
    }
    else if (!isValidPincode(this.merchant.address.pincode)) {
      swal('', "Enter valid pincode", 'warning');
      return false;
    }
    return true;
  }


}