import ar from './ar.json';
import en from './en.json';

const dictionaries = {
  ar,
  en,
};

export type AdminDictionary = typeof ar;

export const getAdminDictionary = (locale: string): AdminDictionary => {
  return dictionaries[locale as keyof typeof dictionaries] || dictionaries.ar;
};
