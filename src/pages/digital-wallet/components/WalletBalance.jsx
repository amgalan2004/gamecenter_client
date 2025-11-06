import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatCurrency, t } from '../../../utils/i18n';

const WalletBalance = ({ balance, recentChange, onTopUp }) => {
  return (
    <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Wallet" size={24} color="white" />
          <h2 className="text-lg font-semibold">{t('wallet.balance')}</h2>
        </div>
        <div className="flex items-center space-x-1 text-sm opacity-90">
          <Icon name="Shield" size={16} color="white" />
          <span>{t('secured')}</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-3xl font-bold mb-2">{formatCurrency(balance)}</div>
        {recentChange && (
          <div className={`flex items-center space-x-1 text-sm ${
            recentChange?.amount > 0 ? 'text-green-200' : 'text-red-200'
          }`}>
            <Icon 
              name={recentChange?.amount > 0 ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
            />
            <span>
              {recentChange?.amount > 0 ? '+' : ''}{formatCurrency(recentChange?.amount)} 
              {' ' + recentChange?.period}
            </span>
          </div>
        )}
      </div>
      <div className="flex space-x-3">
        <Button
          variant="secondary"
          onClick={onTopUp}
          iconName="Plus"
          iconPosition="left"
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          {t('top.up')}
        </Button>
        <Button
          variant="ghost"
          iconName="History"
          iconPosition="left"
          className="text-white hover:bg-white/20"
        >
          {t('history')}
        </Button>
      </div>
    </div>
  );
};

export default WalletBalance;