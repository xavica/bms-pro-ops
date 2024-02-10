import { RoleType } from './enums';
import { Crm, Customer, Merchant } from '../entities';
import { Promotion } from '../entities/promotion';
export class ApplicationState {
  userId: string;
  crmId: string = "";
  crm: Crm = new Crm();
  customer: Customer;
  searchedMerchants = new Array<Merchant>();
  searchedCustomers = new Array<Customer>();
  merchant: Merchant;
  navigatedItems: any;
  dbCustomers: Array<any> = [];
  userRoleType: RoleType;
  merchantId: string;
  promotion  = new Array<Promotion>();
  constructor() {
  }
}
