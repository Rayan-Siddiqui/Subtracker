import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Fixed color map per category
const COLOR_MAP = {
  Netflix: '#ef4444',
  Spotify: '#10b981',
  Gaming: '#3b82f6',
  Software: '#f59e0b',
  Other: '#8b5cf6'
};

export default function SubscriptionChart({ subscriptions }) {

  const map = {};

  subscriptions.forEach((sub) => {
    const cat = sub.category || 'Other';
    map[cat] = (map[cat] || 0) + Number(sub.monthlyCost || 0);
  });

  const data = Object.keys(map).map((key) => ({
    name: key,
    value: map[key]
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        No chart data yet
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">
        Spending Breakdown
      </h2>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>

            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLOR_MAP[entry.name] || '#64748b'}
                />
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