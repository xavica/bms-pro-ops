
export class CustomerSourceValueConverter {
  toView(value: number): string {
    var source: string = "";
    switch (value) {
      case 1:
        source = "Customer App";
        break;
      case 2:
        source = "Sales Aid App";
        break;
      case 3:
        source = "Bulk Import";
        break;
      case 5:
        source = "Created By Merchant";
        break;
      case 6:
        source = "Created For Counter Sale";
        break;
      case 7:
        source = "Counter Sale Aid App"
        break;
      default:
        source = "UnKnown";
        break;
    }
    return source;
  }
}
