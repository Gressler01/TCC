export type Harvest = {
  id: string;
  date: string;
  quantityInGrams: number;
  notes: string;
};

export type NewHarvest = Omit<Harvest, 'id'>;
