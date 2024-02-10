import { Aurelia, inject, NewInstance } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ApplicationState } from '../../../common';
import { BootstrapFormRenderer } from '../../../bootstrap-validation';
import { ValidationController } from 'aurelia-validation';
import { APP_ROUTES } from '../../../constants/app_routes';
import { Merchant, MerchantSearchFields } from '../../../entities';
import { MerchantService } from '../../../services';

@inject(Router, ApplicationState, NewInstance.of(ValidationController), MerchantService)
export class MerchantSearch {
  merchants: Array<Merchant> = [];
  searchFields: {
    id: string,
    mobileNumber: string,
    nameLowerCase
    : string,
    city: string
  } = {
      id: '',
      mobileNumber: '',
      nameLowerCase: '',
      city: ''
    };
  searchedMerchants: Array<Merchant> = [];
  bootStrapRenderer: BootstrapFormRenderer;
  isLoading: boolean = false;
  merchantList: Array<any> = [];

  constructor(private router: Router,
    private appState: ApplicationState, private controller: ValidationController,
    private merchantService: MerchantService) {
  }

  async activate() {
    this.bootStrapRenderer = new BootstrapFormRenderer();
    this.controller.addRenderer(this.bootStrapRenderer);
  }

  async searchMerchants() {
    try {
      let value = '';
      if (this.searchFields == undefined) {

        swal('', "Atleast One Field Value is Required", 'warning');
      }
      if (
        !this.searchFields.id &&
        !this.searchFields.mobileNumber &&
        !this.searchFields.nameLowerCase
        &&
        !this.searchFields.city.toLowerCase()
      ) {
        swal("", "Atleast One Field Value is Required", "warning");
        this.searchedMerchants = new Array<Merchant>();
      }

      this.merchantList = await this.merchantService.getAllMerchantsFB();
      if (!this.merchantList.length) {
        swal("No Merchants Found")
        return
      }

      this.isLoading = true;
      const searchedMerchants: Array<any> = [];
      for (const key in this.searchFields) {
        value = this.searchFields[key];

        if (value) {
          value =
            key === "nameLowerCase"
              ? this.searchFields[key].toLowerCase().trim()
              : key === "city"
                ? this.searchFields[key].toLowerCase().trim()
                : this.searchFields[key].trim();

          const searchResult: Array<any> = this.merchantList.filter(m => key == "nameLowerCase" ? m.nameSearchKey.includes(value.toLocaleLowerCase()) : key == "city" ? m.citySearchKey.includes(value.toLocaleLowerCase()) : key == "id" ? m.id.includes(value) : key == "mobileNumber" ? m.mobileNumber.includes(value) : []);
          searchedMerchants.push(searchResult);

          if (searchResult.length == 0) {
            swal('', 'No Records Found', 'info');
          }

        }
      }

      this.searchedMerchants = [].concat.apply([], searchedMerchants);
      this.isLoading = false;
    } catch (error) {
      console.log("error", error);
    }
  }


  rowClick(merchant: Merchant) {
    this.appState.merchant = merchant;
    this.router.navigateToRoute(APP_ROUTES.MERCHANT_DETAILS);
  }

  clearClicked() {
    this.controller.reset();
    this.searchFields = new MerchantSearchFields();
    this.searchedMerchants = new Array<Merchant>();
    this.appState.searchedMerchants = new Array<Merchant>();
    this.appState.merchant = new Merchant();
  }

  createMerchant() {
    this.router.navigateToRoute(APP_ROUTES.CREATE_MERCHANT);

  }
}
