import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../../common/application-state';

@inject(Router, ApplicationState)
export class SideBarViewModel {
  constructor(private router: Router,private appState: ApplicationState) {
  }
}