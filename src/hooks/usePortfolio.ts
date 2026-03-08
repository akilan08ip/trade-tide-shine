import { useState, useEffect, useCallback } from 'react';

export interface PortfolioItem {
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  buyPrice: number;
  addedAt: number;
}

const STORAGE_KEY = 'crypto-portfolio';

function loadPortfolio(): PortfolioItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(loadPortfolio);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  const addCoin = useCallback((item: Omit<PortfolioItem, 'addedAt'>) => {
    setPortfolio(prev => {
      const existing = prev.find(p => p.coinId === item.coinId);
      if (existing) {
        return prev.map(p => p.coinId === item.coinId
          ? { ...p, amount: p.amount + item.amount, buyPrice: (p.buyPrice * p.amount + item.buyPrice * item.amount) / (p.amount + item.amount) }
          : p
        );
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  const removeCoin = useCallback((coinId: string) => {
    setPortfolio(prev => prev.filter(p => p.coinId !== coinId));
  }, []);

  const updateAmount = useCallback((coinId: string, amount: number) => {
    setPortfolio(prev => prev.map(p => p.coinId === coinId ? { ...p, amount } : p));
  }, []);

  return { portfolio, addCoin, removeCoin, updateAmount };
}
