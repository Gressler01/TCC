export type Expense = {
  id: string;
  description: string;
  date: string;
  amountInCents: number;
};

export type NewExpense = Omit<Expense, 'id'>;
