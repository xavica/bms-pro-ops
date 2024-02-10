import { BusinessType } from './../../common/enums';
export class BusinessTypeValueConverter {
  toView(value: number): string {
    return BusinessType[value];
  }
}
