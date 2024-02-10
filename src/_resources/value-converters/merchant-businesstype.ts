import { MerchantBusinessType } from './../../common/enums';
export class merchantBusinessTypeValueConverter {
  toView(value: number): string {
    let businessType=Object.keys(MerchantBusinessType).map(key => {
      return {
          id: MerchantBusinessType[key],
          name: key,
      };
  }).filter(x => x.id === value );
  return businessType.length>0?businessType[0].name:'';
  }
  
}