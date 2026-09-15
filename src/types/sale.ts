export type SaleType = 'tray' | 'kilogram';

export type Sale = {
  id: string;
  client: string;
  date: string;
  saleType: SaleType;
  quantity: number;
  totalInCents: number;
};

export type NewSale = Omit<Sale, 'id'>;
