import { useState, useEffect } from 'react';

export interface AppSettings {
  currency: string;
  unitSystem: string;
  notifications: boolean;
  darkMode: boolean;
  autoSave: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'BRL',
  unitSystem: 'metric',
  notifications: true,
  darkMode: false,
  autoSave: true,
};

const STORAGE_KEY = 'obracalc-settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Carregar configurações do localStorage na inicialização
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Salvar no localStorage sempre que as configurações mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Erro ao salvar configurações:', error);
      }
    }
  }, [settings]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}

// Função auxiliar para formatar moeda baseado nas configurações
export function formatCurrency(value: number, currencyCode: string): string {
  const currencySymbols: Record<string, string> = {
    BRL: 'R$',
    USD: '$',
    EUR: '€',
    ARS: 'ARS',
    UYU: 'UYU',
  };

  const symbol = currencySymbols[currencyCode] || currencyCode;
  
  return `${symbol} ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Função auxiliar para converter unidades baseado nas configurações
export function convertUnit(value: number, fromUnit: string, unitSystem: string): {
  value: number;
  unit: string;
} {
  if (unitSystem === 'imperial') {
    // Conversões básicas de métrico para imperial
    const conversions: Record<string, { factor: number; unit: string }> = {
      m: { factor: 3.28084, unit: 'ft' },
      m2: { factor: 10.7639, unit: 'ft²' },
      m3: { factor: 35.3147, unit: 'ft³' },
      cm: { factor: 0.393701, unit: 'in' },
      kg: { factor: 2.20462, unit: 'lb' },
      l: { factor: 0.264172, unit: 'gal' },
    };

    const conversion = conversions[fromUnit.toLowerCase()];
    if (conversion) {
      return {
        value: value * conversion.factor,
        unit: conversion.unit,
      };
    }
  }

  return { value, unit: fromUnit };
}
