import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionModal from "@/components/TransactionModal";
import QuickStats from "@/components/QuickStats";
import RecentTransactions from "@/components/RecentTransactions";
import { Transaction, Goal } from "@/types";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budgetpal-transactions');
    const savedGoals = localStorage.getItem('budgetpal-goals');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('budgetpal-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('budgetpal-goals', JSON.stringify(goals));
  }, [goals]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const openModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpenses;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">BudgetPal</h1>
          <p className="text-gray-600 text-sm">{today}</p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              KSh {netBalance.toLocaleString()}
            </div>
            <div className="flex justify-between mt-4 text-sm opacity-90">
              <div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Income
                </div>
                <div className="font-semibold">KSh {totalIncome.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <TrendingDown className="w-4 h-4" />
                  Expenses
                </div>
                <div className="font-semibold">KSh {totalExpenses.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => openModal('income')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white h-14 text-lg font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Income
          </Button>
          <Button 
            onClick={() => openModal('expense')}
            className="bg-red-500 hover:bg-red-600 text-white h-14 text-lg font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Quick Stats */}
        <QuickStats transactions={transactions} />

        {/* Recent Transactions */}
        <RecentTransactions 
          transactions={transactions.slice(0, 5)} 
          onTransactionUpdate={setTransactions}
        />

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 gap-4 pb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <h3 className="font-semibold text-gray-700">Goals</h3>
              <p className="text-sm text-gray-500 mt-1">{goals.length} active</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <h3 className="font-semibold text-gray-700">Analytics</h3>
              <p className="text-sm text-gray-500 mt-1">View trends</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        onSubmit={addTransaction}
      />
    </div>
  );
};

export default Index;
