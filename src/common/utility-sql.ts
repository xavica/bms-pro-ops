import { toCustomArray } from '.';

export function sortElements(array: Array<any>, name: string) {
  return array.sort(function (a, b) {
    return parseFloat(b[name]) - parseFloat(a[name]);
  });
}
export function formatQuotations(orders: Array<any>) {
  orders.forEach((order) => {
    if (order && order.quotations) {
      order.quotations = toCustomArray(order.quotations);
    }
  });
}

