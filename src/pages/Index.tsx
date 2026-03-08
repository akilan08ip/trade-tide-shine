import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MarketStats from '@/components/MarketStats';
import TopMovers from '@/components/TopMovers';
import CoinRow from '@/components/CoinRow';
import { useCoins } from '@/hooks/useCryptoData';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: coins, isLoading } = useCoins(page);

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
        <MarketStats />
        {coins && <TopMovers coins={coins} />}

        {/* Coin table */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 text-xs font-medium text-muted-foreground">
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
                {isLoading
                  ? Array.from({ length: 20 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td colSpan={8} className="py-3 px-4">
                          <Skeleton className="h-7 w-full" />
                        </td>
                      </tr>
                    ))
                  : filtered.map((coin, i) => <CoinRow key={coin.id} coin={coin} index={i} />)
                }
              </tbody>
            </table>
          </div>

          {!search && (
            <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
              <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <span className="text-xs font-mono text-muted-foreground">Page {page}</span>
              <Button variant="ghost" size="sm" onClick={() => setPage(p => p + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
