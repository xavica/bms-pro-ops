import { RoleType } from './common';

export class QWIPORoutes {
  routes;
  constructor() {
    this.routes = [
      // Support Member / CRM routes
      // anonymous access
      { route: 'login', name: 'login', moduleId: './pages/crm/login', nav: false, title: 'Login' },
      { route: 'signup', name: 'signup', moduleId: './pages/crm/signup', nav: false, auth: false, title: 'SignUp', settings: { css: 'zmdi zmdi-home' } },
      { route: ['', 'crm-welcome'], name: 'crm-welcome', moduleId: './pages/crm/crm-welcome', nav: true, auth: true, title: 'Welcome', settings: { css: 'zmdi zmdi-home' } },
      // { route: 'customer-search', name: 'customer-search', moduleId: './pages/customer/customer-search', nav: true, auth: true, title: 'Customer', settings: { css: 'zmdi zmdi-accounts',role:[RoleType.SupportMember,RoleType.TeleCaller,RoleType.InternalDepartment,RoleType.ProductionSupport,RoleType.OnBoardingTeam]} },
      // { route: 'customer-details', name: 'customer-details', moduleId: './pages/customer/customer-details', nav: false, auth: true, settings: { css: 'zmdi zmdi-accounts' } },
      // { route: 'unregistered-customers', name: 'unregistered-customers', moduleId: './pages/customer/unregistered-customers', nav: true, auth: true, title: 'Unregistered Customers', settings: { css: 'zmdi zmdi-accounts',role:[RoleType.SupportMember,RoleType.TeleCaller,RoleType.InternalDepartment,RoleType.ProductionSupport,RoleType.OnBoardingTeam] } },
      // { route: 'viwito-notifications', name: 'viwito-notifications', moduleId: './pages/viwito-notifications/viwito-notifications', nav: true, auth: true, title: 'Viwito Notifications', settings: { css: 'zmdi zmdi-accounts',role:[RoleType.SupportMember,RoleType.TeleCaller,RoleType.InternalDepartment,RoleType.ProductionSupport,RoleType.OnBoardingTeam] } },
      { route: 'merchant-search', name: 'merchant-search', moduleId: './pages/merchant/search/merchant-search', nav: true, auth: true, title: 'Merchant', settings: { css: 'zmdi zmdi-accounts', role: [RoleType.SupportMember, RoleType.TeleCaller, RoleType.InternalDepartment, RoleType.ProductionSupport, RoleType.OnBoardingTeam] } },
      { route: 'merchant-details', name: 'merchant-details', moduleId: './pages/merchant/details/merchant-details', nav: false, auth: true, settings: { css: 'zmdi zmdi-accounts' } },
      { route: 'create-merchant', name: 'create-merchant', moduleId: './pages/merchant/create/create-merchant', nav: false, auth: true, settings: { css: 'zmdi zmdi-accounts' } },
      // { route: 'promotion-search', name: 'promotion-search', moduleId: './pages/promotions/promotion-search/promotion-search', nav: true, auth: true, title: 'Promotion', settings: { css: 'zmdi zmdi-accounts',role:[RoleType.SupportMember,RoleType.TeleCaller,RoleType.InternalDepartment,RoleType.ProductionSupport,RoleType.OnBoardingTeam]} },
      // { route: 'distributor-search', name: 'distributor-search', moduleId: './pages/promotions/distributor-search/distributor-search', nav: false, auth: true, settings: { css: 'zmdi zmdi-accounts' } },
      // { route: 'create-promotion', name: 'create-promotion', moduleId: './pages/promotions/create-promotion/create-promotion', nav: false, auth: true, settings: { css: 'zmdi zmdi-accounts' } },
      // { route: 'promotion-details', name: 'promotion-details', moduleId: './pages/promotions/promotion-details/promotion-details', nav: false, auth: true, settings: { css: 'zmdi zmdi-accounts' } },
      // { route: 'company-manage', name: 'company-manage', moduleId: './pages/company/company-manage', nav: true, auth: true, title: 'Company Master', settings: { css: 'zmdi zmdi-settings', role: [RoleType.SupportMember, RoleType.TeleCaller, RoleType.InternalDepartment, RoleType.ProductionSupport, RoleType.OnBoardingTeam] } },
      { route: 'vendor-geo-mapping', name: 'vendor-geo-mapping', moduleId: './pages/vendor-geo-mapping/vendor-geo-mapping', nav: true, auth: true, title: 'Vendor Geo Mapping', settings: { css: 'zmdi zmdi-star-half', role: [RoleType.SupportMember, RoleType.TeleCaller, RoleType.InternalDepartment, RoleType.ProductionSupport, RoleType.OnBoardingTeam] } },
      { route: 'vendor-geo-details', name: 'vendor-geo-details', moduleId: './pages/vendor-geo-mapping/vendor-geo-details', nav: false, auth: true },
    ];
  }
}
