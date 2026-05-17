"use client";

import React, { createContext, useContext } from 'react';
import type { AdminDictionary } from '@/dictionaries/admin';

interface AdminTranslationContextType {
  dict: AdminDictionary;
  locale: string;
  t: (ar: string, en: string) => string;
}

const AdminTranslationContext = createContext<AdminTranslationContextType | null>(null);

export const AdminTranslationProvider = ({
  children,
  dict,
  locale
}: {
  children: React.ReactNode;
  dict: AdminDictionary;
  locale: string;
}) => {
  const t = (ar: string, en: string) => locale === 'ar' ? ar : en;

  return (
    <AdminTranslationContext.Provider value={{ dict, locale, t }}>
      {children}
    </AdminTranslationContext.Provider>
  );
};

export const useAdminTranslation = () => {
  const context = useContext(AdminTranslationContext);
  if (!context) {
    throw new Error('useAdminTranslation must be used within an AdminTranslationProvider');
  }
  return context;
};
