import { ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onTransactionUpdate: (transactions: Transaction[]) => void;
}

const RecentTransactions = ({ transactions, onTransactionUpdate }: RecentTransactionsProps) => {
  const deleteTransaction = (id: string) => {
    const updatedTransactions = JSON.parse(localStorage.getItem('budgetpal-transactions') || '[]')
      .filter((t: Transaction) => t.id !== id);
    localStorage.setItem('budgetpal-transactions', JSON.stringify(updatedTransactions));
    onTransactionUpdate(updatedTransactions);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Start by adding your first income or expense</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              {transaction.type === 'income' ? (
                <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold ${
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}KSh {transaction.amount.toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTransaction(transaction.id)}
                className="text-gray-400 hover:text-red-500 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {transactions.length >= 5 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm">
              View All Transactions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
