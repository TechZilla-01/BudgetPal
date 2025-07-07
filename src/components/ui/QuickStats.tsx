import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";

interface QuickStatsProps {
  transactions: Transaction[];
}

const QuickStats = ({ transactions }: QuickStatsProps) => {
  // Calculate category totals for expenses
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 categories

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p>No expenses recorded yet</p>
            <p className="text-sm mt-2">Add some expenses to see your spending breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spending Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="space-y-2">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{entry.name}</span>
              </div>
              <span className="text-sm font-semibold">KSh {entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
