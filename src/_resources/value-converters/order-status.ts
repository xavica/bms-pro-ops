import { OrderStatus } from '../../common/enums';
export class OrderStatusValueConverter {
    toView(value: number): string {
        return OrderStatus[value];
    }
}