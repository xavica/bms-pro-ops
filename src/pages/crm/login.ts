import { FirebaseService } from './../../services/firebase.service';
import { Router } from 'aurelia-router';
import { inject, NewInstance } from 'aurelia-framework';
import { Crm } from '../../entities';
import { ApplicationState } from '../../common/application-state';
import { ValidationController, validateTrigger, ValidationRules } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../bootstrap-validation';
import { APP_ROUTES } from '../../constants/app_routes';
import { UserService } from "../../services";

@inject(Router, ApplicationState, NewInstance.of(ValidationController), UserService, FirebaseService)
export class CRMLogin {
  bootStrapRenderer: BootstrapFormRenderer;
  emailToReset: string = '';
  username: string = "";
  password: string = "";
  debug: boolean = false;
  isLoading: boolean = false;
  constructor(private router: Router,
    private appState: ApplicationState,
    private controller: ValidationController,
    private userService: UserService,
    private firebaseService: FirebaseService) {
    this.controller = controller;
    ValidationRules
      .ensure('username').required().withMessage("This information is required").email()
      .ensure('password').required().withMessage("This information is required").minLength(6)
      .ensure('emailToReset').required().withMessage("This information is required").email().withMessage("Enter a valid Email")
      .on(this)
  }
  async activate(params: { debug: string; }) {
    this.debug = params && params.debug === "1";
    this.bootStrapRenderer = new BootstrapFormRenderer();
    this.controller.addRenderer(this.bootStrapRenderer);
    if (this.appState.userId) {
      await this.firebaseService.setAuthTokenToLocalStorage();
      this.router.navigate(APP_ROUTES.CRM_WELCOME);
    }
  }

  async login() {
    this.isLoading = true;
    this.controller.validate().then((errors) => {
      if (!errors.length || (errors.length === 1 && errors[0].propertyName === 'emailToReset')) {
        this.firebaseService.signInWithEmailAndPassword(this.username, this.password)
          .then((result) => {
            console.log("result::", result);
            this.userService.getUser(result.uid).then((user) => {
              if (user && user.isActive) {
                this.appState.userId = result.uid;
                this.appState.userRoleType = user.roleTypeId;
                this.firebaseService.setAuthTokenToLocalStorage().then(result => {
                  this.isLoading = false;
                  this.router.navigate(APP_ROUTES.CRM_WELCOME);
                });
              }
              else {
                this.userService.logout().then(() => {
                  this.appState.userId = "";
                  this.appState.crm = new Crm();
                  this.isLoading = false;
                }, (error) => {
                  console.log("Signout error");
                });
                swal("Not a Suitable User", "Please enter valid credentials to login CRM", "warning");
              }
            });
          }).catch((error) => {
            let errorMessage = error.message;
            swal("Login Failed", errorMessage, "error");
            this.isLoading = false;
          });
      }
      else {
        swal("", "Please enter valid details", "warning");
        this.isLoading = false;
      }
    });
  }
  sendLink() {
    this.controller.validate().then((errors) => {
      let validations = errors.filter((error) => {
        return error.propertyName === 'emailToReset';
      });
      if (!errors.length || !validations) {
        firebase.auth().sendPasswordResetEmail(this.emailToReset).then(() => {
          swal("", "Link sent to ' " + this.emailToReset + " '", "success");
          this.resetFields();
        }).catch((error) => {
          swal("", "Please Enter a registered Email", "warning");
        });
      }
      else {
        swal("", "Please enter valid details", "warning");
      }
    });
  }
  resetFields() {
    this.emailToReset = '';
    this.username = '';
    this.password = '';
  }
  signup() {
    this.router.navigateToRoute(APP_ROUTES.SIGN_UP);
  }
}
