import { useParams, Link } from 'react-router-dom';
import { useCoinDetail, useCoinChart } from '@/hooks/useCryptoData';
import Header from '@/components/Header';
import { formatPrice, formatINR, formatMarketCap, formatMarketCapINR, formatPercent } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, IndianRupee, Activity, TrendingUp, TrendingDown, BarChart3, Layers, Infinity as InfinityIcon, Trophy, Target } from 'lucide-react';
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
            { label: 'Market Cap', value: fmtCap(md.market_cap.usd, md.market_cap.inr), icon: BarChart3, gradient: 'from-primary/20 via-primary/5 to-transparent', iconColor: 'text-primary' },
            { label: '24h Volume', value: fmtCap(md.total_volume.usd, md.total_volume.inr), icon: Activity, gradient: 'from-[hsl(217,91%,60%)]/20 via-[hsl(217,91%,60%)]/5 to-transparent', iconColor: 'text-[hsl(217,91%,60%)]' },
            { label: '24h High', value: fmt(md.high_24h.usd, md.high_24h.inr), icon: TrendingUp, gradient: 'from-primary/20 via-primary/5 to-transparent', iconColor: 'text-primary' },
            { label: '24h Low', value: fmt(md.low_24h.usd, md.low_24h.inr), icon: TrendingDown, gradient: 'from-destructive/20 via-destructive/5 to-transparent', iconColor: 'text-destructive' },
            { label: 'Circulating Supply', value: md.circulating_supply.toLocaleString(), icon: Layers, gradient: 'from-[hsl(280,65%,60%)]/20 via-[hsl(280,65%,60%)]/5 to-transparent', iconColor: 'text-[hsl(280,65%,60%)]' },
            { label: 'Max Supply', value: md.max_supply ? md.max_supply.toLocaleString() : '∞', icon: Infinity, gradient: 'from-[hsl(190,80%,50%)]/20 via-[hsl(190,80%,50%)]/5 to-transparent', iconColor: 'text-[hsl(190,80%,50%)]' },
            { label: 'All-Time High', value: fmt(md.ath.usd, md.ath.inr), icon: Trophy, gradient: 'from-warning/20 via-warning/5 to-transparent', iconColor: 'text-warning' },
            { label: 'All-Time Low', value: fmt(md.atl.usd, md.atl.inr), icon: Target, gradient: 'from-destructive/20 via-destructive/5 to-transparent', iconColor: 'text-destructive' },
          ].map(({ label, value, icon: Icon, gradient, iconColor }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -6, scale: 1.04, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.97 }}
              className="glass-card rounded-xl p-4 border-glow cursor-default group relative overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`} />
              
              {/* Floating icon background */}
              <div className="absolute -right-2 -top-2 opacity-[0.04] group-hover:opacity-[0.1] transition-opacity duration-500">
                <Icon className="h-16 w-16" />
              </div>

              <div className="relative">
                <div className="flex items-center gap-1.5 mb-2">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.3 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className={`h-3.5 w-3.5 ${iconColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                  </motion.div>
                  <p className="text-xs text-muted-foreground font-medium">{label}</p>
                </div>
                <motion.p
                  key={`${currency}-${label}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-bold font-mono tracking-tight"
                >
                  {value}
                </motion.p>
              </div>
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
            ].map(({ label, value }, i) => {
              const positive = value >= 0;
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.96 }}
                  className={`rounded-xl p-3.5 cursor-default relative overflow-hidden group border transition-all duration-300 ${
                    positive
                      ? 'bg-gain/5 border-gain/20 hover:border-gain/40 hover:shadow-[0_0_20px_-5px_hsl(var(--gain)/0.3)]'
                      : 'bg-loss/5 border-loss/20 hover:border-loss/40 hover:shadow-[0_0_20px_-5px_hsl(var(--loss)/0.3)]'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${positive ? 'from-gain/10 to-transparent' : 'from-loss/10 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        animate={{ y: [0, positive ? -2 : 2, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className={`text-sm ${positive ? 'text-gain' : 'text-loss'}`}
                      >
                        {positive ? '▲' : '▼'}
                      </motion.span>
                      <p className={`text-sm font-bold font-mono ${positive ? 'text-gain' : 'text-loss'}`}>
                        {formatPercent(value).replace('+', '').replace('-', '')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
