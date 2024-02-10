import { Aurelia, inject } from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction, Redirect, RedirectToRoute } from 'aurelia-router';
import { ApplicationState, UserType } from "./common";
import { QWIPORoutes } from './routes';
import { UserService } from './services';
import { APP_ROUTES } from './constants';
var firebase = require("firebase");

@inject(QWIPORoutes, UserService, ApplicationState)
export class App {
  router: Router;
  constructor(private qwipoRoutes: QWIPORoutes,
    private userService: UserService,
    private appState: ApplicationState) {
    this.qwipoRoutes = qwipoRoutes;
  }
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'VIWITO-CRM';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map(this.qwipoRoutes.routes);
    this.router = router;
  }
}

class AuthorizeStep {
  static inject() { return [UserService, ApplicationState]; }
  constructor(private userService: UserService, private appState: ApplicationState) {
    this.userService = userService;
    this.appState = appState;
  }
  run(navigationInstruction, next) {

    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      return this.isUserLogged().then(() => {
        var isLoggedIn = this.appState.userId;
        if (!isLoggedIn) {
          return next.cancel(new RedirectToRoute(APP_ROUTES.CRM_LOGIN));
        }
        else {
          return this.fillCoreData().then(() => {
            if (!navigationInstruction.config.settings.role || navigationInstruction.config.settings.role.indexOf(this.appState.userRoleType)>-1) {
              return next();
            }
            else {
              return next.cancel(new RedirectToRoute(APP_ROUTES.CRM_HOME));
            }
          });
        }
      });
    }
    //anonymous pages - if any asynchronous functions are there just fill in fillCoreData.
    return this.fillCoreData().then(() => {
      return next();
    });
  }

  isUserLogged() {
    let appState = this.appState;
    return new Promise((resolve, reject) => {
      if (!appState.userId) {
        var observer = function (user) {
          if (user && user.uid) {
            appState.userId = user.uid;
          }
          unsubscribe();
          resolve({});
        }
        var unsubscribe = firebase.auth().onAuthStateChanged(observer);
      }
      else {
        resolve({});
      }
    });
  }
  fillCoreData() {
    return new Promise((resolve, reject) => {
      if (this.appState.userId && !this.appState.crm.id) {
        this.userService.getUser(this.appState.userId).then((userResult) => {
          this.appState.userRoleType = userResult && userResult.roleTypeId || null;
          Object.assign(this.appState.crm, userResult);
          resolve({});
        });
      }
      else {
        resolve({});
      }
    });
  }
}
