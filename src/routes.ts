import { RouteConfig } from 'aurelia-router';
import { RoleType } from './common';

export class QWIPORoutes {
  routes: RouteConfig | RouteConfig[];
  constructor() {
    this.routes = [
      // Support Member / CRM routes
      // anonymous access
      { route: 'login', name: 'login', moduleId: './pages/crm/login', nav: false, title: 'Login' },
      { route: 'signup', name: 'signup', moduleId: './pages/crm/signup', nav: false, auth: false, title: 'SignUp', settings: { css: 'zmdi zmdi-home' } },
      { route: ['', 'crm-welcome'], name: 'crm-welcome', moduleId: './pages/crm/crm-welcome', nav: true, auth: true, title: 'Welcome', settings: { css: 'zmdi zmdi-home' } },
      { route: 'merchant-search', name: 'merchant-search', moduleId: './pages/merchant/search/merchant-search', nav: true, auth: true, title: 'Merchant', settings: { css: 'zmdi zmdi-accounts',role:[RoleType.SupportMember,RoleType.TeleCaller,RoleType.InternalDepartment,RoleType.ProductionSupport,RoleType.OnBoardingTeam] } },
      { route: 'merchant-details', name: 'merchant-details', moduleId: './pages/merchant/details/merchant-details', nav: false, auth: true, settings: { css: 'zmdi zmdi-accounts' } },
      { route: 'create-merchant', name: 'create-merchant', moduleId: './pages/merchant/create/create-merchant', nav: false, auth: true, settings: { css: 'zmdi zmdi-accounts' } },
      { route: 'vendor-geo-mapping', name: 'vendor-geo-mapping', moduleId: './pages/vendor-geo-mapping/vendor-geo-mapping', nav: true, auth: true, title: 'Vendor Geo Mapping', settings: { css: 'zmdi zmdi-star-half',role:[RoleType.SupportMember,RoleType.TeleCaller,RoleType.InternalDepartment,RoleType.ProductionSupport,RoleType.OnBoardingTeam] } },
      { route: 'vendor-geo-details', name: 'vendor-geo-details', moduleId: './pages/vendor-geo-mapping/vendor-geo-details', nav: false, auth: true },
    ];
  }
}
