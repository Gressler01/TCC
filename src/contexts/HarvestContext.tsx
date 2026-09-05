import { createContext, useContext, useRef, useState, type ReactNode } from 'react';

import { mockHarvests } from '../constants/mockHarvests';
import type { Harvest, NewHarvest } from '../types/harvest';

type HarvestContextValue = {
  harvests: Harvest[];
  period: string;
  setPeriod: (period: string) => void;
  addHarvest: (harvest: NewHarvest) => void;
};

const HarvestContext = createContext<HarvestContextValue | null>(null);

export function HarvestProvider({ children }: { children: ReactNode }) {
  const [harvests, setHarvests] = useState(mockHarvests);
  const [period, setPeriod] = useState('2025-05');
  const nextId = useRef(1);

  function addHarvest(harvest: NewHarvest) {
    const record = { ...harvest, id: `new-harvest-${nextId.current++}` };
    setHarvests((current) => [record, ...current]);
    setPeriod(harvest.date.slice(0, 7));
  }

  return (
    <HarvestContext.Provider value={{ harvests, period, setPeriod, addHarvest }}>
      {children}
    </HarvestContext.Provider>
  );
}

export function useHarvests() {
  const context = useContext(HarvestContext);
  if (!context) throw new Error('useHarvests must be used inside HarvestProvider.');
  return context;
}
