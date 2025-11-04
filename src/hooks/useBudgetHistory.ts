import { useState, useEffect } from 'react';
import { CalculationItem } from '../App';

export interface SavedBudget {
  id: string;
  name: string;
  items: CalculationItem[];
  totalBudget: number;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
}

const STORAGE_KEY = 'obracalc-budget-history';
const MAX_HISTORY_ITEMS = 50; // Limite de orçamentos salvos

export function useBudgetHistory() {
  const [history, setHistory] = useState<SavedBudget[]>(() => {
    // Carregar histórico do localStorage na inicialização
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Ordenar por data de atualização mais recente
          return parsed.sort((a: SavedBudget, b: SavedBudget) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
      } catch (error) {
        console.error('Erro ao carregar histórico de orçamentos:', error);
      }
    }
    return [];
  });

  // Salvar no localStorage sempre que o histórico mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Erro ao salvar histórico de orçamentos:', error);
      }
    }
  }, [history]);

  const saveBudget = (
    name: string,
    items: CalculationItem[],
    totalBudget: number,
    existingId?: string
  ): SavedBudget => {
    const now = new Date().toISOString();
    
    const budget: SavedBudget = {
      id: existingId || `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name || `Orçamento ${new Date().toLocaleDateString('pt-BR')}`,
      items,
      totalBudget,
      createdAt: existingId ? 
        (history.find(b => b.id === existingId)?.createdAt || now) : 
        now,
      updatedAt: now,
      itemCount: items.length,
    };

    setHistory(prev => {
      // Se estiver atualizando um orçamento existente, remover o antigo
      const filtered = prev.filter(b => b.id !== budget.id);
      
      // Adicionar o novo/atualizado no início
      const updated = [budget, ...filtered];
      
      // Limitar ao número máximo de itens
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });

    return budget;
  };

  const loadBudget = (id: string): SavedBudget | undefined => {
    return history.find(b => b.id === id);
  };

  const deleteBudget = (id: string): void => {
    setHistory(prev => prev.filter(b => b.id !== id));
  };

  const deleteAllBudgets = (): void => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const duplicateBudget = (id: string): SavedBudget | null => {
    const original = history.find(b => b.id === id);
    if (!original) return null;

    const duplicated = saveBudget(
      `${original.name} (Cópia)`,
      original.items,
      original.totalBudget
    );

    return duplicated;
  };

  const updateBudgetName = (id: string, newName: string): void => {
    setHistory(prev => prev.map(b => 
      b.id === id 
        ? { ...b, name: newName, updatedAt: new Date().toISOString() }
        : b
    ));
  };

  const searchBudgets = (query: string): SavedBudget[] => {
    if (!query.trim()) return history;
    
    const lowerQuery = query.toLowerCase();
    return history.filter(budget =>
      budget.name.toLowerCase().includes(lowerQuery) ||
      budget.items.some(item => 
        item.description.toLowerCase().includes(lowerQuery) ||
        item.type.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const getBudgetStats = () => {
    return {
      total: history.length,
      totalValue: history.reduce((sum, b) => sum + b.totalBudget, 0),
      totalItems: history.reduce((sum, b) => sum + b.itemCount, 0),
      averageValue: history.length > 0 
        ? history.reduce((sum, b) => sum + b.totalBudget, 0) / history.length 
        : 0,
      oldestDate: history.length > 0 
        ? history[history.length - 1].createdAt 
        : null,
      newestDate: history.length > 0 
        ? history[0].createdAt 
        : null,
    };
  };

  return {
    history,
    saveBudget,
    loadBudget,
    deleteBudget,
    deleteAllBudgets,
    duplicateBudget,
    updateBudgetName,
    searchBudgets,
    getBudgetStats,
  };
}
