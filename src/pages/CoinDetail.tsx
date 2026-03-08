import { useParams, Link } from 'react-router-dom';
import { useCoinDetail, useCoinChart } from '@/hooks/useCryptoData';
import Header from '@/components/Header';
import { formatPrice, formatMarketCap, formatPercent } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const timeRanges = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '1y', days: 365 },
];

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: coin, isLoading } = useCoinDetail(id!);
  const [days, setDays] = useState(7);
  const { data: chartData } = useCoinChart(id!, days);

  const chartFormatted = useMemo(() => {
    if (!chartData) return [];
    return chartData.prices.map(([time, price]) => ({
      time,
      date: new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price,
    }));
  }, [chartData]);

  const isPositive = coin ? coin.market_data.price_change_percentage_24h >= 0 : true;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </main>
      </div>
    );
  }

  if (!coin) return null;
  const md = coin.market_data;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6 md:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Markets
        </Link>

        {/* Coin header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={coin.image.large} alt={coin.name} className="h-12 w-12 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {coin.name}
                <span className="text-sm font-mono uppercase text-muted-foreground">{coin.symbol}</span>
                <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium">Rank #{md.market_cap_rank}</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold font-mono">{formatPrice(md.current_price.usd)}</span>
                <span className={`text-lg font-mono font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
                  {formatPercent(md.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card rounded-lg p-4">
          <div className="mb-4 flex items-center gap-2">
            {timeRanges.map(tr => (
              <Button
                key={tr.days}
                variant={days === tr.days ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDays(tr.days)}
                className="text-xs"
              >
                {tr.label}
              </Button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartFormatted}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} tickFormatter={(v) => formatPrice(v)} width={80} />
              <Tooltip
                contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'hsl(215, 15%, 55%)' }}
                formatter={(value: number) => [formatPrice(value), 'Price']}
              />
              <Area type="monotone" dataKey="price" stroke={isPositive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'} fill="url(#colorPrice)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Market Cap', value: formatMarketCap(md.market_cap.usd) },
            { label: '24h Volume', value: formatMarketCap(md.total_volume.usd) },
            { label: '24h High', value: formatPrice(md.high_24h.usd) },
            { label: '24h Low', value: formatPrice(md.low_24h.usd) },
            { label: 'Circulating Supply', value: md.circulating_supply.toLocaleString() },
            { label: 'Max Supply', value: md.max_supply ? md.max_supply.toLocaleString() : '∞' },
            { label: 'All-Time High', value: formatPrice(md.ath.usd) },
            { label: 'All-Time Low', value: formatPrice(md.atl.usd) },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-bold font-mono">{value}</p>
            </div>
          ))}
        </div>

        {/* Price changes */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Price Change</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: '24h', value: md.price_change_percentage_24h },
              { label: '7d', value: md.price_change_percentage_7d },
              { label: '30d', value: md.price_change_percentage_30d },
              { label: '1y', value: md.price_change_percentage_1y },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md bg-secondary/50 p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-sm font-bold font-mono ${value >= 0 ? 'text-gain' : 'text-loss'}`}>{formatPercent(value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {coin.description.en && (
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2">About {coin.name}</h3>
            <div
              className="text-sm text-muted-foreground leading-relaxed prose prose-invert max-w-none prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: coin.description.en.split('. ').slice(0, 5).join('. ') + '.' }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
