import { AppointmentType } from "@/enums/commons";
import { HttpStatusCode } from "../enums/httpStatusCode";

export class PaginatedTableResponse<T> {
  ResponseData: T[] = [];
  Count = 0;
  TotalValue?: number = 0;

    constructor(init?: Partial<PaginatedTableResponse<T>>) {
        Object.assign(this, init);
    }
}

export class GetPaginatedDTO {
    Take = 10;
    Skip = 0;
    SearchValue?: string;
    Date?: Date;
    AppointmentType?: AppointmentType;

    constructor(init?: Partial<GetPaginatedDTO>) {
        Object.assign(this, init);
    }
}

export class TableStates {
  page = 1;
  pageSize = 10;

  constructor(init?: Partial<TableStates>) {
        Object.assign(this, init);
    }
}

export class GeneralResponse<T> {
  IsSuccess = false;
  Message = "";
    StatusCode: HttpStatusCode = HttpStatusCode.BadRequest;
    Data?: T | null = null;

    constructor(init?: Partial<GeneralResponse<T>>) {
        Object.assign(this, init);
    }
}

export class GetAuditableEntityDTO {
    // Created
    CreatedBy = "";
    CreatedAt = "";

    // Updated
    UpdatedBy = "";
    UpdatedAt = "";

    constructor(init?: Partial<GetAuditableEntityDTO>) {
        Object.assign(this, init);
    }
}

export class PaginatedCountsResponse {
  AllCount = 0;
  PendingCount = 0;
  ApprovedCount = 0;
  RejectedCount = 0;
  CanceledCount = 0;
  DoneCount = 0;
  IssuedCount = 0;
  AcknowledgedCount = 0;
  ResolvedCount = 0;

  constructor(init?: Partial<PaginatedCountsResponse>) {
    Object.assign(this, init);
  }
}

export class CoordinatesDTO {
    Latitude: number = 0;
    Longitude: number = 0;

    constructor(init?: Partial<CoordinatesDTO>) {
        Object.assign(this, init);
    }
}

export class MapFeatureProps {
    iconUrl: string = '';
    popupContent?: string = '';
    radius?: number = 0;

    constructor(init?: Partial<MapFeatureProps>) {
        Object.assign(this, init);
    }
}
