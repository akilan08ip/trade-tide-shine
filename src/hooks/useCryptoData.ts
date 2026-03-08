import { useQuery } from '@tanstack/react-query';
import { fetchCoins, fetchGlobalData, fetchTrending, fetchCoinDetail, fetchCoinChart } from '@/lib/api';

export function useCoins(page = 1) {
  return useQuery({
    queryKey: ['coins', page],
    queryFn: () => fetchCoins(page),
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function useGlobalData() {
  return useQuery({
    queryKey: ['global'],
    queryFn: fetchGlobalData,
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrending,
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: ['coin', id],
    queryFn: () => fetchCoinDetail(id),
    enabled: !!id,
    refetchInterval: 30000,
  });
}

export function useCoinChart(id: string, days: number) {
  return useQuery({
    queryKey: ['chart', id, days],
    queryFn: () => fetchCoinChart(id, days),
    enabled: !!id,
    staleTime: 60000,
  });
}
