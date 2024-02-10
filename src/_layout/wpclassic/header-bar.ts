import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ApplicationState } from '../../common/application-state';
import { UserService } from '../../services';
import { Crm } from '../../entities';
import { APP_ROUTES } from '../../constants/app_routes'

@inject(Router, ApplicationState, UserService)
export class HeaderViewModel {
  notFound: boolean = false;
  constructor(private router: Router,
    private appState: ApplicationState,
    private userService: UserService) {
  }
  activate() {
  }
  
  logout() {
    let resetMessage: any = {
      title: "Are you sure you want to logout?",
      type: "warning", showCancelButton: true,
      confirmButtonColor: "#13BB6F",
      confirmButtonText: "Yes",
      closeOnConfirm: true
    };
    swal(resetMessage, async () => {
      this.userService.logout().then(() => {
        this.appState.userId = "";
        this.appState.crm = new Crm();
        this.router.navigateToRoute(APP_ROUTES.CRM_LOGIN);
      }, (error) => {
        console.log("Signout error");
      });
    });
  }
}


