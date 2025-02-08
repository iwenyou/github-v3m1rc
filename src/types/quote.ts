export interface CabinetItem {
  id: string;
  productId?: string;
  material?: string;
  width: number;
  height: number;
  depth: number;
  price: number;
  count?: number;
  isPriceLocked?: boolean;
}

export interface Space {
  id: string;
  name: string;
  items: CabinetItem[];
}