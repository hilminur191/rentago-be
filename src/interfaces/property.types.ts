export interface ICreateRoomParam {
  name: string;
  description?: string | null;
  basePrice: number;
  capacity: number;
  quantity?: number;
}

export interface ICreatePropertyParam {
  tenantId: string;
  categoryId?: string;
  categoryName?: string;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  pictures?: string[];
  rooms?: ICreateRoomParam[];
}

export interface PropertyQuery {
  search?: string | undefined;
  categoryId?: string | undefined;
  city?: string | undefined;
  province?: string | undefined;
  page?: string | undefined;
  limit?: string | undefined;
  minPrice?: string | undefined;
  maxPrice?: string | undefined;
}

