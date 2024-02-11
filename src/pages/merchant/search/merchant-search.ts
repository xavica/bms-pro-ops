import { Aurelia, inject, NewInstance } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ApplicationState, UserType } from '../../../common';
import { BootstrapFormRenderer } from '../../../bootstrap-validation';
import { ValidationController, ValidationRules } from 'aurelia-validation';
import { APP_ROUTES } from '../../../constants/app_routes';
import { Merchant, MerchantSearchFields, QueryFilter } from '../../../entities';
import { MerchantService } from '../../../services';
import * as swal from 'sweetalert';

@inject(Router, MerchantService, ApplicationState, NewInstance.of(ValidationController))
export class MerchantSearch {
  merchants: Array<Merchant> = [];
  searchFields: MerchantSearchFields = new MerchantSearchFields();
  searchedMerchants: Array<Merchant> = [];
  bootStrapRenderer: BootstrapFormRenderer;
  constructor(private router: Router, private userService: MerchantService,
    private appState: ApplicationState, private controller: ValidationController) {
  }

  activate() {
    this.bootStrapRenderer = new BootstrapFormRenderer();
    this.controller.addRenderer(this.bootStrapRenderer);
    this.defineValidationRules();
  }

  defineValidationRules() {
    ValidationRules
      .ensure('nameLowerCase').maxLength(20).matches(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/).withMessage("This information is required")
      .ensure('mobileNumber').matches(/^[0-9]*$/).minLength(5).maxLength(14).withMessage("Please enter valid mobile number")
      .ensure('cityLowerCase').maxLength(20).matches(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/).withMessage("This information is required")
      .on(this.searchFields);
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
  merchantsByQuery() {
    let queryFilters = this.constructQueryParams();
    this.userService.usersQuery(queryFilters, UserType.ViwitoMerchants).then((result) => {
      if (result.length === 0) {
        swal('', 'No Records Found', 'info');
      }
      console.log("result::",result)
      this.searchedMerchants = result;
    });
  }

  searchMerchants() {
    if (!this.searchFields.id && !this.searchFields.nameLowerCase && !this.searchFields.mobileNumber && !this.searchFields.cityLowerCase) {
      swal('', "Atleast One Field Value is Required", 'warning');
      this.merchants = new Array<Merchant>();
    }
    else {
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

  rowClick(merchant: Merchant) {
    this.appState.merchant = merchant;
    this.appState.searchedMerchants = this.merchants;
    console.log("this.merchants",this.merchants)
    this.router.navigateToRoute(APP_ROUTES.MERCHANT_DETAILS);
  }

  // rowClick(merchant: Merchant) {
  //   this.appState.merchant = merchant;
  //   this.router.navigateToRoute(APP_ROUTES.MERCHANT_DETAILS);
  // }

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
