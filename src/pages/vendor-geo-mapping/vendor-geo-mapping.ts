import { Aurelia, inject, NewInstance } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ApplicationState } from '../../common';
import { BootstrapFormRenderer } from '../../bootstrap-validation';
import { ValidationController } from 'aurelia-validation';
import { APP_ROUTES } from '../../constants/app_routes';
import { MerchantService } from '../../services';
import { Merchant, QueryFilter } from '../../entities';

@inject(Router, ApplicationState, NewInstance.of(ValidationController),MerchantService)
export class VendorGeoMapping {
  merchants: Array<Merchant> = [];
  searchFields: {
    id: string;
    nameLowerCase: string;
    mobileNumber: string;
  };

  searchedMerchants: Array<Merchant> = [];
  bootStrapRenderer: BootstrapFormRenderer;
  mobileNumber: string;
  showDetails: boolean = false;
  address: string;
  isLoader: boolean = false;
  constructor(private router: Router,
    private appState: ApplicationState,
    private controller: ValidationController,
    private merchantService: MerchantService,
    ) {
  }

  async activate() {
    this.bootStrapRenderer = new BootstrapFormRenderer();
    this.controller.addRenderer(this.bootStrapRenderer);
  }

  private constructQueryParams(): Array<QueryFilter> {
    let params: Array<QueryFilter> = [];
    for (var property in this.searchFields) {
      if (this.searchFields[property]) {
        let fieldValue = this.searchFields[property];
        fieldValue = property === 'id' && fieldValue
          || fieldValue && fieldValue.toLowerCase()
          || '';
        params.push(new QueryFilter(property, fieldValue));
      }
    }
    return params;
  }

  async merchantsByQuery() {
    const queryFilters = this.constructQueryParams();
    const searchedMerchants: Array<any> = [];
    this.searchedMerchants = [];

    for (const query of queryFilters) {
      if (query.fieldValue) {
        const searchResult: Array<any> = await this.merchantService.merchantSearchFB(query.fieldName, query.fieldValue);
        searchedMerchants.push(searchResult);
      }
    }

    this.searchedMerchants = [].concat.apply([], searchedMerchants);

    if (this.searchedMerchants.length === 0) {
      swal('', 'No Records Found', 'info');

      return;
    }
  }
  async searchMerchants() {
    this.isLoader = true;
    if (!this.searchFields.id && !this.searchFields.mobileNumber) {
      swal('', "Enter valid MobileNumber", 'warning');
      this.merchants = new Array<Merchant>();
      this.isLoader = false;
    }
    else {
      this.isLoader = false;
      this.controller.validate().then((errors) => {
        if (!errors.length) {
          this.merchantsByQuery();
        }
        else {
          swal('', "Invalid Input Details", 'warning');
        }
      });
    }
  }
  onClick(merchant: Merchant) {
    this.isLoader = true;
    if (merchant.companies && merchant.companies.length) {
      this.appState.merchant = merchant;
      this.router.navigateToRoute(APP_ROUTES.VENDOR_GEO_DETAILS);
    }
    else {
      swal('', "No companies configured for this vendor", 'warning')
    }
    this.isLoader = false;
  }
}

