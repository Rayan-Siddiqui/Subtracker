// Import chart tools from recharts
import {
  PieChart,
  Pie,
  Tooltip,
  Legend
} from 'recharts';

export default function SubscriptionChart({ subscriptions = [] }) {
  // Safety check (prevents crashes)
  if (!Array.isArray(subscriptions)) {
    return <p className="text-red-500">Error loading chart</p>;
  }

  // Create category totals
  const categoryMap = {};

  subscriptions.forEach((sub) => {
    const category = sub.category || 'Other';
    const cost = Number(sub.monthlyCost || 0);

    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }

    categoryMap[category] += cost;
  });

  // Convert into chart data format
  const chartData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));

  // If no data, show message
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

      {/* Fixed size container to prevent recharts error */}
      <div style={{ width: '100%', height: 300 }}>
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}