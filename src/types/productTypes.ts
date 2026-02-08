import { ApprovalStatus, UOM } from "@/enums/commons";

export class CreateProductDTO {
  Title: string = "";
  Description: string = "";
  UOM?: UOM;
  ReflenishAmount?: number;
  AtCost?: number;

  constructor(init?: Partial<CreateProductDTO>) {
    return Object.assign(this, init);
  }
}

export class GetProductPaginatedDTO {
  Id: number = 0;
  Title: string = "";
  UOM: UOM = UOM.ML;
  Quantity: number = 0;
  PackagingQty: number = 0;

  constructor(init?: Partial<GetProductPaginatedDTO>) {
    return Object.assign(this, init);
  }
}

export class CreateDeliveryProductsDTOP {
  Notes?: string;
  ApprovalStatus?: ApprovalStatus;
  RejectReason?: string;
  SelectedProducts: SelectedProductDTO[] = [];

  constructor(init?: Partial<CreateDeliveryProductsDTOP>) {
    return Object.assign(this, init);
  }
}

export class SelectedProductDTO {
  POItemId?: number;
  ProductId: number = 0;
  Title: string = "";
  UOM: UOM = UOM.ML;
  Quantity: number = 0;
  Receive: number = 0;
  PkgQty: number = 0;
  AtCostPrice: number = 0;

  constructor(init?: Partial<SelectedProductDTO>) {
    return Object.assign(this, init);
  }
}

export class GetRequestStocksDTO {
  Id: number = 0;
  CreatedBy: string = "";
  DateCreated: Date = new Date();
  TotalItems: number = 0;
  ApprovalStatus: ApprovalStatus = ApprovalStatus.PENDING;

  constructor(init?: Partial<GetRequestStocksDTO>) {
    return Object.assign(this, init);
  }
}
