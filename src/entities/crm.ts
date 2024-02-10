import { UserType, RoleType } from '../common';
import { Address } from '.';

export class Crm {
  id: string;
  userTypeId: UserType = UserType.SupportMember;
  name: string;
  mobileNumber: string;
  isActive: boolean = false;
  email: string;
  address: Address;
  roleTypeId: RoleType;
}
