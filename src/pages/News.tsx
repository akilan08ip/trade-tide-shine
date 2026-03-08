import Header from '@/components/Header';
import { useTrending } from '@/hooks/useCryptoData';
import { formatPrice, formatPercent } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Flame, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function News() {
  const { data: trending, isLoading } = useTrending();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6 md:px-6">
        <h1 className="text-2xl font-bold">Crypto News & Trending</h1>

        {/* Trending coins */}
        <div className="glass-card rounded-lg p-4">
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold">Trending on CoinGecko</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {trending?.coins.map((t, i) => (
                <motion.div
                  key={t.item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/coin/${t.item.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border/30 p-4 transition-all hover:bg-secondary/30 hover:border-border"
                  >
                    <img src={t.item.small} alt={t.item.name} className="h-10 w-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{t.item.name}</span>
                        <span className="text-xs font-mono text-muted-foreground">{t.item.symbol}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-mono">{formatPrice(t.item.data?.price ?? 0)}</span>
                        {t.item.data?.price_change_percentage_24h?.usd != null && (
                          <span className={`text-xs font-mono font-semibold ${t.item.data.price_change_percentage_24h.usd >= 0 ? 'text-gain' : 'text-loss'}`}>
                            {formatPercent(t.item.data.price_change_percentage_24h.usd)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Crypto News links */}
        <div className="glass-card rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-4">Latest Crypto News Sources</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              { name: 'CoinDesk', url: 'https://www.coindesk.com', desc: 'Leading crypto news and analysis' },
              { name: 'CoinTelegraph', url: 'https://cointelegraph.com', desc: 'Blockchain and crypto media' },
              { name: 'The Block', url: 'https://www.theblock.co', desc: 'Digital asset research & news' },
              { name: 'Decrypt', url: 'https://decrypt.co', desc: 'Web3, crypto & blockchain news' },
              { name: 'CryptoSlate', url: 'https://cryptoslate.com', desc: 'Cryptocurrency news & data' },
              { name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com', desc: 'Original Bitcoin publication' },
            ].map(source => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-border/30 p-4 transition-all hover:bg-secondary/30 hover:border-border group"
              >
                <div>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{source.name}</p>
                  <p className="text-xs text-muted-foreground">{source.desc}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
