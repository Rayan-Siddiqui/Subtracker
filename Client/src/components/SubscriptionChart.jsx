// Import chart tools
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function SubscriptionChart({ subscriptions }) {
  // Count total cost per category
  const categoryMap = {};

  subscriptions.forEach((sub) => {
    const category = sub.category || 'Other';
    const cost = Number(sub.monthlyCost || 0);

    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }

    categoryMap[category] += cost;
  });

  // Convert object into chart-friendly array
  const chartData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));

  // Fallback message if there is no data
  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Spending by Category</h2>
        <p className="text-gray-500">No chart data yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Spending by Category</h2>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}