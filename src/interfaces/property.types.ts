export interface ICreateRoomParam {
  name: string;
  description?: string | null;
  basePrice: number;
  capacity: number;
}

export interface ICreatePropertyParam {
  tenantId: string;
  categoryId?: string | undefined;
  categoryName?: string | undefined; 
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  picture?: string | null;
  rooms?: ICreateRoomParam[];
}

