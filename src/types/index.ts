export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  autoTrack: boolean;
}

export const INCOME_CATEGORIES = [
  'Salary',
  'Tips',
  'Sales',
  'Freelance',
  'Business',
  'Others'
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Rent',
  'Airtime',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Others'
];
