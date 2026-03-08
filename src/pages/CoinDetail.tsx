import { useParams, Link } from 'react-router-dom';
import { useCoinDetail, useCoinChart } from '@/hooks/useCryptoData';
import Header from '@/components/Header';
import { formatPrice, formatINR, formatMarketCap, formatMarketCapINR, formatPercent } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, IndianRupee, Activity, TrendingUp, TrendingDown, BarChart3, Layers, Infinity, Trophy, Target } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';

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
  const [currency, setCurrency] = useState<'usd' | 'inr'>('usd');
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

  const fmt = (usd: number, inr: number) => currency === 'usd' ? formatPrice(usd) : formatINR(inr);
  const fmtCap = (usd: number, inr: number) => currency === 'usd' ? formatMarketCap(usd) : formatMarketCapINR(inr);

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
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Markets
          </Link>

          {/* Currency toggle */}
          <div className="flex items-center glass-card rounded-full p-1 gap-0.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrency('usd')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                currency === 'usd'
                  ? 'bg-primary text-primary-foreground shadow-[0_0_12px_hsl(142,71%,45%/0.3)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <DollarSign className="h-3 w-3" />
              USD
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrency('inr')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                currency === 'inr'
                  ? 'bg-primary text-primary-foreground shadow-[0_0_12px_hsl(142,71%,45%/0.3)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <IndianRupee className="h-3 w-3" />
              INR
            </motion.button>
          </div>
        </div>

        {/* Coin header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.img
              src={coin.image.large}
              alt={coin.name}
              className="h-14 w-14 rounded-full ring-2 ring-border/50"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {coin.name}
                <span className="text-sm font-mono uppercase text-muted-foreground">{coin.symbol}</span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">Rank #{md.market_cap_rank}</span>
              </h1>
              <div className="flex flex-col gap-1 mt-2">
                {/* Primary price */}
                <div className="flex items-center gap-3">
                  <motion.span
                    key={`${currency}-price`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold font-mono"
                  >
                    {fmt(md.current_price.usd, md.current_price.inr)}
                  </motion.span>
                  <span className={`text-lg font-mono font-semibold px-2 py-0.5 rounded-md ${
                    isPositive ? 'text-gain bg-gain/10' : 'text-loss bg-loss/10'
                  }`}>
                    {isPositive ? '▲' : '▼'} {formatPercent(md.price_change_percentage_24h).replace('+', '').replace('-', '')}
                  </span>
                </div>
                {/* Secondary price (the other currency) */}
                <motion.span
                  key={`${currency}-secondary`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-mono text-muted-foreground"
                >
                  ≈ {currency === 'usd' ? formatINR(md.current_price.inr) : formatPrice(md.current_price.usd)}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5"
        >
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
          {chartFormatted.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartFormatted}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isPositive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(0, 0%, 50%)', fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: 'hsl(0, 0%, 50%)', fontSize: 11 }} tickFormatter={(v) => formatPrice(v)} width={80} />
                <Tooltip
                  contentStyle={{ background: 'hsl(0, 0%, 6%)', border: '1px solid hsl(0, 0%, 12%)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'hsl(0, 0%, 50%)' }}
                  formatter={(value: number) => [formatPrice(value), 'Price (USD)']}
                />
                <Area type="monotone" dataKey="price" stroke={isPositive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'} fill="url(#colorPrice)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground text-sm">
              <div className="text-center space-y-2">
                <div className="animate-pulse text-2xl">📊</div>
                <p>Chart data loading...</p>
                <p className="text-xs text-muted-foreground/60">Free API may be rate-limited. Try again shortly.</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats grid - showing both currencies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {[
            { label: 'Market Cap', value: fmtCap(md.market_cap.usd, md.market_cap.inr) },
            { label: '24h Volume', value: fmtCap(md.total_volume.usd, md.total_volume.inr) },
            { label: '24h High', value: fmt(md.high_24h.usd, md.high_24h.inr) },
            { label: '24h Low', value: fmt(md.low_24h.usd, md.low_24h.inr) },
            { label: 'Circulating Supply', value: md.circulating_supply.toLocaleString() },
            { label: 'Max Supply', value: md.max_supply ? md.max_supply.toLocaleString() : '∞' },
            { label: 'All-Time High', value: fmt(md.ath.usd, md.ath.inr) },
            { label: 'All-Time Low', value: fmt(md.atl.usd, md.atl.inr) },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="glass-card rounded-xl p-3.5 border-glow"
            >
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <motion.p
                key={`${currency}-${label}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-bold font-mono"
              >
                {value}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Price changes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-3">Price Change</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: '24h', value: md.price_change_percentage_24h },
              { label: '7d', value: md.price_change_percentage_7d },
              { label: '30d', value: md.price_change_percentage_30d },
              { label: '1y', value: md.price_change_percentage_1y },
            ].map(({ label, value }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.03 }}
                className="rounded-lg bg-secondary/50 p-3"
              >
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-sm font-bold font-mono ${value >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {value >= 0 ? '▲' : '▼'} {formatPercent(value).replace('+', '').replace('-', '')}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        {coin.description.en && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold mb-2">About {coin.name}</h3>
            <div
              className="text-sm text-muted-foreground leading-relaxed prose prose-invert max-w-none prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: coin.description.en.split('. ').slice(0, 5).join('. ') + '.' }}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}
