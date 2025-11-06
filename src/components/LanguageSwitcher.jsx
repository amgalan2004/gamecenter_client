import React, { useState } from 'react';
import { setLanguage, getCurrentLanguage, SUPPORTED_LANGUAGES } from '../utils/i18n';
import Icon from './AppIcon';
import Button from './ui/Button';

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    // Reload page to apply language changes
    window.location?.reload();
  };

  const getLangIcon = (lang) => {
    switch (lang) {
      case 'mn':
        return '🇲🇳';
      case 'en':
        return '🇺🇸';
      default:
        return '🌐';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <span className="text-lg">{getLangIcon(currentLang)}</span>
        <span className="hidden md:inline text-sm">
          {SUPPORTED_LANGUAGES?.[currentLang]}
        </span>
        <Icon name="ChevronDown" size={16} />
      </Button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
            <div className="py-1">
              {Object.entries(SUPPORTED_LANGUAGES)?.map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`w-full px-4 py-2 text-left hover:bg-muted flex items-center space-x-3 ${
                    currentLang === code ? 'bg-muted text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <span className="text-lg">{getLangIcon(code)}</span>
                  <span className="text-sm">{name}</span>
                  {currentLang === code && (
                    <Icon name="Check" size={16} className="ml-auto text-success" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;