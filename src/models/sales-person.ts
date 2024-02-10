export interface IMerchantSalesPerson {
    erpSalesPersonId: string
    id: string,
    mobilenumber: string,
    name: string,
    distributors: Record<string, { id: string, name: string, vrsId: string }> | { id: string, name: string, vrsId: string }[];
}