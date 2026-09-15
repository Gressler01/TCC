import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { createHarvest, listHarvests } from '../services/records';
import type { Harvest, NewHarvest } from '../types/harvest';

type HarvestContextValue = {
  harvests: Harvest[];
  period: string;
  setPeriod: (period: string) => void;
  loading: boolean;
  error: string;
  addHarvest: (harvest: NewHarvest) => Promise<void>;
};

const HarvestContext = createContext<HarvestContextValue | null>(null);

export function HarvestProvider({ children }: { children: ReactNode }) {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [period, setPeriod] = useState(() => new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listHarvests()
      .then((records) => {
        setHarvests(records);
        if (records[0]) setPeriod(records[0].date.slice(0, 7));
      })
      .catch(() => setError('Não foi possível carregar as colheitas.'))
      .finally(() => setLoading(false));
  }, []);

  async function addHarvest(harvest: NewHarvest) {
    const record = await createHarvest(harvest);
    setHarvests((current) => [record, ...current]);
    setPeriod(harvest.date.slice(0, 7));
  }

  return (
    <HarvestContext.Provider value={{ harvests, period, setPeriod, loading, error, addHarvest }}>
      {children}
    </HarvestContext.Provider>
  );
}

export function useHarvests() {
  const context = useContext(HarvestContext);
  if (!context) throw new Error('useHarvests must be used inside HarvestProvider.');
  return context;
}
