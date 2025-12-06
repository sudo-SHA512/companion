import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SupportedLanguage } from '@/types/framework';
import { getTranslation } from '@/i18n/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode; initialLanguage?: SupportedLanguage }> = ({ 
  children, 
  initialLanguage = 'de' 
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);

  const t = useCallback((key: string) => {
    return getTranslation(language, key);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
