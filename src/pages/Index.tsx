import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MarketStats from '@/components/MarketStats';
import TopMovers from '@/components/TopMovers';
import CoinRow from '@/components/CoinRow';
import { useCoins, useTrending } from '@/hooks/useCryptoData';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flame, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice, formatPercent } from '@/lib/api';

const Index = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: coins, isLoading } = useCoins(page);
  const { data: trending } = useTrending();

  const filtered = useMemo(() => {
    if (!coins) return [];
    if (!search) return coins;
    const q = search.toLowerCase();
    return coins.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
  }, [coins, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearch} />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6 md:px-6">
        {/* Hero welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">
              <span className="gradient-text">Crypto Markets</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time prices, charts & market data</p>
          </div>

          {/* Trending coins ticker */}
          {trending && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 glass-card rounded-full px-4 py-2"
            >
              <Flame className="h-3.5 w-3.5 text-warning flex-shrink-0" />
              <span className="text-xs text-muted-foreground flex-shrink-0">Trending:</span>
              <div className="flex items-center gap-2 overflow-hidden">
                {trending.coins.slice(0, 4).map((t, i) => (
                  <Link
                    key={t.item.id}
                    to={`/coin/${t.item.id}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <img src={t.item.thumb} alt={t.item.name} className="h-4 w-4 rounded-full" />
                    <span className="text-xs font-mono font-medium whitespace-nowrap">{t.item.symbol}</span>
                    {i < 3 && <span className="text-border mx-0.5">·</span>}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        <MarketStats />
        {coins && <TopMovers coins={coins} />}

        {/* Coin table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold">All Cryptocurrencies</h2>
              <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 rounded-full px-2 py-0.5">
                {filtered.length} coins
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-gain pulse-dot" />
              Auto-refreshing
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 pl-4 pr-2 text-left">#</th>
                  <th className="py-3 pr-4 text-left">Coin</th>
                  <th className="py-3 pr-4 text-right">Price</th>
                  <th className="py-3 pr-4 text-right">24h</th>
                  <th className="hidden py-3 pr-4 text-right md:table-cell">7d</th>
                  <th className="hidden py-3 pr-4 text-right lg:table-cell">Market Cap</th>
                  <th className="hidden py-3 pr-4 text-right lg:table-cell">Volume</th>
                  <th className="hidden py-3 pr-4 text-right xl:table-cell">7d Chart</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {isLoading
                    ? Array.from({ length: 20 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/20">
                          <td colSpan={8} className="py-3.5 px-4">
                            <div className="shimmer h-8 w-full rounded-md" />
                          </td>
                        </tr>
                      ))
                    : filtered.map((coin, i) => <CoinRow key={coin.id} coin={coin} index={i} />)
                  }
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {!search && (
            <div className="flex items-center justify-between border-t border-border/30 px-5 py-3 bg-secondary/10">
              <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="gap-1.5">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
              </motion.div>
              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, page + 2))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPage(pageNum)}
                      className={`h-8 w-8 rounded-lg text-xs font-mono font-medium transition-all ${
                        page === pageNum
                          ? 'bg-primary text-primary-foreground shadow-[0_0_12px_hsl(142,71%,45%/0.3)]'
                          : 'text-muted-foreground hover:bg-secondary/50'
                      }`}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>
              <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" onClick={() => setPage(p => p + 1)} className="gap-1.5">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
