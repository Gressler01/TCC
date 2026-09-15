import type { Expense, NewExpense } from '../types/expense';
import type { Harvest, NewHarvest } from '../types/harvest';
import type { NewSale, Sale } from '../types/sale';
import { supabase } from './supabase';

export async function listHarvests(): Promise<Harvest[]> {
  const { data, error } = await supabase
    .from('harvests')
    .select('id, harvest_date, quantity_grams, notes')
    .order('harvest_date', { ascending: false });

  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    date: row.harvest_date,
    quantityInGrams: row.quantity_grams,
    notes: row.notes ?? '',
  }));
}

export async function createHarvest(harvest: NewHarvest): Promise<Harvest> {
  const { data, error } = await supabase
    .from('harvests')
    .insert({
      harvest_date: harvest.date,
      quantity_grams: harvest.quantityInGrams,
      notes: harvest.notes || null,
    })
    .select('id, harvest_date, quantity_grams, notes')
    .single();

  if (error) throw error;
  return {
    id: data.id,
    date: data.harvest_date,
    quantityInGrams: data.quantity_grams,
    notes: data.notes ?? '',
  };
}

export async function listExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('id, description, expense_date, amount_cents')
    .order('expense_date', { ascending: false });

  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    description: row.description,
    date: row.expense_date,
    amountInCents: row.amount_cents,
  }));
}

export async function createExpense(expense: NewExpense): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      description: expense.description,
      expense_date: expense.date,
      amount_cents: expense.amountInCents,
    })
    .select('id, description, expense_date, amount_cents')
    .single();

  if (error) throw error;
  return {
    id: data.id,
    description: data.description,
    date: data.expense_date,
    amountInCents: data.amount_cents,
  };
}

export async function listSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from('sales')
    .select('id, client, sale_date, sale_type, quantity, total_cents')
    .order('sale_date', { ascending: false });

  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    client: row.client,
    date: row.sale_date,
    saleType: row.sale_type,
    quantity: Number(row.quantity),
    totalInCents: row.total_cents,
  }));
}

export async function createSale(sale: NewSale): Promise<Sale> {
  const { data, error } = await supabase
    .from('sales')
    .insert({
      client: sale.client,
      sale_date: sale.date,
      sale_type: sale.saleType,
      quantity: sale.quantity,
      total_cents: sale.totalInCents,
    })
    .select('id, client, sale_date, sale_type, quantity, total_cents')
    .single();

  if (error) throw error;
  return {
    id: data.id,
    client: data.client,
    date: data.sale_date,
    saleType: data.sale_type,
    quantity: Number(data.quantity),
    totalInCents: data.total_cents,
  };
}
