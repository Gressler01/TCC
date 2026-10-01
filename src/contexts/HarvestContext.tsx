import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { createHarvest, listHarvests, updateHarvest, deleteRecord } from '../services/records';
import type { Harvest, NewHarvest } from '../types/harvest';
import { toLocalDateString } from '../utils/dates';

type HarvestContextValue = {
  harvests: Harvest[];
  period: string;
  setPeriod: (period: string) => void;
  loading: boolean;
  error: string;
  editHarvest: (id: string, harvest: NewHarvest) => Promise<void>;
  removeHarvest: (id: string) => Promise<void>;
  addHarvest: (harvest: NewHarvest) => Promise<void>;
};

const HarvestContext = createContext<HarvestContextValue | null>(null);

export function HarvestProvider({ children }: { children: ReactNode }) {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [period, setPeriod] = useState(() => toLocalDateString(new Date()).slice(0, 7));
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

  async function editHarvest(id: string, harvest: NewHarvest) {
    const record = await updateHarvest(id, harvest);
    setHarvests((current) => current.map((item) => item.id === id ? record : item));
    setPeriod(record.date.slice(0, 7));
  }

  async function removeHarvest(id: string) {
    await deleteRecord('harvests', id);
    setHarvests((current) => current.filter((item) => item.id !== id));
  }

  return (
    <HarvestContext.Provider value={{ harvests, period, setPeriod, loading, error, addHarvest, editHarvest, removeHarvest }}>
      {children}
    </HarvestContext.Provider>
  );
}

export function useHarvests() {
  const context = useContext(HarvestContext);
  if (!context) throw new Error('useHarvests must be used inside HarvestProvider.');
  return context;
}
