import { Router } from 'aurelia-router';
import { inject, NewInstance } from 'aurelia-framework';
import { ApplicationState } from '../../common/application-state';
import { ValidationController } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../bootstrap-validation';
import { UserService } from "../../services";

@inject(Router, ApplicationState, NewInstance.of(ValidationController), UserService)
export class CRMWelcome {
  bootStrapRenderer: BootstrapFormRenderer;
}
