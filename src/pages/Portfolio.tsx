import { useState } from 'react';
import Header from '@/components/Header';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useCoins } from '@/hooks/useCryptoData';
import { formatPrice, formatPercent } from '@/lib/api';
import { generatePortfolioPDF } from '@/lib/generatePortfolioPDF';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Wallet, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Portfolio() {
  const { portfolio, addCoin, removeCoin } = usePortfolio();
  const { data: coins } = useCoins(1);
  const [open, setOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [coinSearch, setCoinSearch] = useState('');

  const priceMap = new Map(coins?.map(c => [c.id, c]) ?? []);

  const portfolioWithPrices = portfolio.map(p => {
    const live = priceMap.get(p.coinId);
    const currentPrice = live?.current_price ?? p.buyPrice;
    const totalValue = currentPrice * p.amount;
    const totalCost = p.buyPrice * p.amount;
    const pnl = totalValue - totalCost;
    const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
    const change24h = live?.price_change_percentage_24h ?? 0;
    return { ...p, currentPrice, totalValue, totalCost, pnl, pnlPercent, change24h, image: live?.image ?? p.image };
  });

  const totalValue = portfolioWithPrices.reduce((s, p) => s + p.totalValue, 0);
  const totalCost = portfolioWithPrices.reduce((s, p) => s + p.totalCost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const handleAdd = () => {
    if (!selectedCoin || !amount || !buyPrice) return;
    const coin = coins?.find(c => c.id === selectedCoin);
    if (!coin) return;
    addCoin({ coinId: coin.id, symbol: coin.symbol, name: coin.name, image: coin.image, amount: parseFloat(amount), buyPrice: parseFloat(buyPrice) });
    setOpen(false);
    setSelectedCoin('');
    setAmount('');
    setBuyPrice('');
  };

  const filteredCoins = coins?.filter(c =>
    c.name.toLowerCase().includes(coinSearch.toLowerCase()) || c.symbol.toLowerCase().includes(coinSearch.toLowerCase())
  ).slice(0, 20);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
          <div className="flex items-center gap-2">
            {portfolio.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => generatePortfolioPDF({
                  totalValue, totalCost, totalPnl, totalPnlPercent,
                  holdings: portfolioWithPrices.map(p => ({
                    name: p.name, symbol: p.symbol, amount: p.amount,
                    buyPrice: p.buyPrice, currentPrice: p.currentPrice,
                    totalValue: p.totalValue, totalCost: p.totalCost,
                    pnl: p.pnl, pnlPercent: p.pnlPercent,
                  })),
                })}
              >
                <FileDown className="h-4 w-4 mr-1" /> Download PDF
              </Button>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Coin</Button>
              </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle>Add to Portfolio</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input placeholder="Search coin..." value={coinSearch} onChange={e => setCoinSearch(e.target.value)} className="mb-2 bg-secondary/50" />
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {filteredCoins?.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCoin(c.id); setBuyPrice(c.current_price.toString()); }}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${selectedCoin === c.id ? 'bg-primary/20 text-primary' : 'hover:bg-secondary/50'}`}
                      >
                        <img src={c.image} alt={c.name} className="h-5 w-5 rounded-full" />
                        {c.name} <span className="text-muted-foreground text-xs">{c.symbol.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="bg-secondary/50" />
                <Input type="number" placeholder="Buy price (USD)" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} className="bg-secondary/50" />
                <Button onClick={handleAdd} className="w-full" disabled={!selectedCoin || !amount || !buyPrice}>Add</Button>
              </div>
             </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Total overview */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1"><Wallet className="h-3.5 w-3.5" /><span className="text-xs">Total Value</span></div>
            <p className="text-2xl font-bold font-mono">{formatPrice(totalValue)}</p>
          </div>
          <div className="glass-card rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Total P&L</p>
            <p className={`text-2xl font-bold font-mono ${totalPnl >= 0 ? 'text-gain' : 'text-loss'}`}>{formatPrice(Math.abs(totalPnl))}</p>
          </div>
          <div className="glass-card rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">P&L %</p>
            <p className={`text-2xl font-bold font-mono ${totalPnlPercent >= 0 ? 'text-gain' : 'text-loss'}`}>{formatPercent(totalPnlPercent)}</p>
          </div>
        </div>

        {/* Holdings */}
        {portfolio.length === 0 ? (
          <div className="glass-card rounded-lg p-12 text-center">
            <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No coins in your portfolio yet. Add your first coin to start tracking!</p>
          </div>
        ) : (
          <div className="glass-card rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 text-xs font-medium text-muted-foreground">
                  <th className="py-3 pl-4 text-left">Coin</th>
                  <th className="py-3 text-right">Holdings</th>
                  <th className="py-3 text-right">Avg Buy</th>
                  <th className="py-3 text-right">Current</th>
                  <th className="py-3 text-right hidden md:table-cell">P&L</th>
                  <th className="py-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {portfolioWithPrices.map((p, i) => (
                  <motion.tr key={p.coinId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/30 hover:bg-secondary/30">
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2">
                        <img src={p.image} alt={p.name} className="h-6 w-6 rounded-full" />
                        <div>
                          <span className="text-sm font-medium">{p.name}</span>
                          <span className="ml-1.5 text-xs text-muted-foreground font-mono">{p.symbol.toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono text-sm">
                      <div>{p.amount}</div>
                      <div className="text-xs text-muted-foreground">{formatPrice(p.totalValue)}</div>
                    </td>
                    <td className="py-3 text-right font-mono text-sm">{formatPrice(p.buyPrice)}</td>
                    <td className="py-3 text-right font-mono text-sm">{formatPrice(p.currentPrice)}</td>
                    <td className="py-3 text-right font-mono text-sm hidden md:table-cell">
                      <span className={p.pnl >= 0 ? 'text-gain' : 'text-loss'}>{formatPrice(Math.abs(p.pnl))}</span>
                      <div className={`text-xs ${p.pnlPercent >= 0 ? 'text-gain' : 'text-loss'}`}>{formatPercent(p.pnlPercent)}</div>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeCoin(p.coinId)} className="h-8 w-8 text-muted-foreground hover:text-loss">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
