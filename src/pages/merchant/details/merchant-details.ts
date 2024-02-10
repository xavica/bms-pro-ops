import { MerchantService } from './../../../services/merchant.service';
import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { ApplicationState } from "../../../common";
import { APP_ROUTES } from "../../../constants";
import { Merchant } from "../../../entities";

@inject(Router, ApplicationState, MerchantService)
export class MerchantDetails {
    merchant: Merchant = new Merchant();
    roleTypeId: number;
    env: string = 'development';
    envCheck: boolean = false;
    isTestEnv: boolean = false;
    constructor(private router: Router, private appState: ApplicationState,
        private merchantService: MerchantService) {
        this.env = this.merchantService.config.env;
    }
    async activate() {
        this.roleTypeId = this.appState.crm.roleTypeId || 0;
        if (this.appState.merchant) {
            this.merchant = this.appState.merchant;
            if (this.merchant.vrsMappingInfo && this.merchant.vrsMappingInfo.apiUrl) {
                this.envCheck = this.checkProdDomain(this.merchant.vrsMappingInfo.apiUrl);
                this.isTestEnv = this.checkTestDomain(this.merchant.vrsMappingInfo.apiUrl);
            }
        } else {
            this.router.navigateToRoute(APP_ROUTES.MERCHANT_SEARCH);
        }
    }
    checkProdDomain(url) {
        return /^https?:\/\/[a-zA-Z0-9]+\.ent\.viwito\.com$/.test(url);
    }
    checkTestDomain(url) {
        return /^https?:\/\/[a-zA-Z0-9]+\.test\.ent\.viwito\.com$/.test(url);
    }

    backButton() {
        this.router.navigateBack();
    }

}
