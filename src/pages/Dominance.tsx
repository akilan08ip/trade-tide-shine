import Header from '@/components/Header';
import { useGlobalData } from '@/hooks/useCryptoData';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = [
  'hsl(38, 92%, 50%)',   // BTC - gold
  'hsl(217, 91%, 60%)',  // ETH - blue
  'hsl(142, 71%, 45%)',  // green
  'hsl(280, 65%, 60%)',  // purple
  'hsl(190, 80%, 50%)',  // cyan
  'hsl(0, 72%, 51%)',    // red
  'hsl(340, 75%, 55%)',  // pink
  'hsl(160, 60%, 45%)',  // teal
];

export default function Dominance() {
  const { data, isLoading } = useGlobalData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">
          <Skeleton className="h-[500px] w-full" />
        </main>
      </div>
    );
  }

  const percentages = data?.data.market_cap_percentage ?? {};
  const entries = Object.entries(percentages).slice(0, 8);
  const othersTotal = Object.values(percentages).slice(8).reduce((s, v) => s + v, 0);

  const chartData = [
    ...entries.map(([name, value]) => ({ name: name.toUpperCase(), value: parseFloat(value.toFixed(2)) })),
    ...(othersTotal > 0 ? [{ name: 'Others', value: parseFloat(othersTotal.toFixed(2)) }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6 md:px-6">
        <h1 className="text-2xl font-bold">Market Dominance</h1>

        <div className="glass-card rounded-lg p-6">
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={180}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={{ stroke: 'hsl(215, 15%, 55%)' }}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: 8 }}
                formatter={(value: number) => [`${value}%`, 'Dominance']}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => <span style={{ color: 'hsl(210, 20%, 92%)' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {entries.map(([name, value], i) => (
            <div key={name} className="glass-card rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs font-medium text-muted-foreground">{name.toUpperCase()}</span>
              </div>
              <p className="text-xl font-bold font-mono">{value.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
