import { FirebaseService } from './../../services/firebase.service';
import { inject, Aurelia, NewInstance } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ApplicationState } from '../../common';
import { Crm } from '../../entities';
import { ValidationController } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../bootstrap-validation';
import { APP_ROUTES } from '../../constants/app_routes';


@inject(NewInstance.of(ValidationController), Router, ApplicationState, FirebaseService)
export class SignUpViewModel {
  appState: ApplicationState;
  router: Router;
  crm: Crm = new Crm();
  password: string = "";
  termsUrl: string;
  controller: ValidationController;
  bootStrapRenderer: BootstrapFormRenderer;

  constructor(controller: ValidationController, router: Router, appState: ApplicationState, private firebaseSevice: FirebaseService) {
    this.controller = controller;
    this.appState = appState;
    this.router = router;
  }
  activate() {
    this.bootStrapRenderer = new BootstrapFormRenderer();
    this.controller.addRenderer(this.bootStrapRenderer);
    if (this.appState.userId) {
      this.router.navigate(APP_ROUTES.CRM_WELCOME);
    }
  }

  preFilledValues() {
  }

  save() {
    this.firebaseSevice.createUserWithEmailAndPassword(this.crm.email, this.password)
      .then(async (result) => {
        await this.saveDealer(result.uid);
        this.router.navigateToRoute(APP_ROUTES.CRM_LOGIN);
      })
      .catch((error) => {
        let errorMessage = error.message;
      });
  }
  login() {
    this.router.navigateToRoute(APP_ROUTES.CRM_LOGIN);
  }
  async saveDealer(uId) {
    this.crm.id = uId;
    this.crm.roleTypeId = 2;
    this.crm.address.country = "INDIA";
    await this.firebaseSevice.insert(`Crm/${uId}`, this.crm);
  }
}
