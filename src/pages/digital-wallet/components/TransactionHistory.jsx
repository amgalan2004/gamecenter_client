import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionHistory = ({ transactions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const transactionTypes = [
    { value: 'all', label: 'All Transactions' },
    { value: 'topup', label: 'Top-ups' },
    { value: 'booking', label: 'Bookings' },
    { value: 'refund', label: 'Refunds' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount_high', label: 'Amount: High to Low' },
    { value: 'amount_low', label: 'Amount: Low to High' },
  ];

  const formatCurrency = (amount) => {
    const n = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(n));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'topup':
        return 'Plus';
      case 'booking':
        return 'Gamepad2';
      case 'refund':
        return 'RotateCcw';
      default:
        return 'DollarSign';
    }
  };

  // amount-аар нь шийднэ
  const getTransactionColor = (amount) => {
    const n = Number(amount) || 0;
    if (n < 0) return 'text-destructive'; // 🔴 зарлага
    if (n > 0) return 'text-success'; // 🟢 орлого
    return 'text-foreground';
  };

  // icon background (улаан/ногоон tint)
  const getIconBg = (amount) => {
    const n = Number(amount) || 0;
    if (n < 0) return 'bg-destructive/15';
    if (n > 0) return 'bg-success/15';
    return 'bg-muted';
  };

  const filteredAndSortedTransactions = useMemo(() => {
    const term = (searchTerm || '').toLowerCase();

    return (transactions || [])
      .filter((t) => {
        const desc = (t?.description || '').toLowerCase();
        const ref = (t?.reference || '').toString().toLowerCase();

        const matchesSearch = !term || desc.includes(term) || ref.includes(term);
        const matchesType = filterType === 'all' || t?.type === filterType;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const ad = new Date(a?.date);
        const bd = new Date(b?.date);
        const at = Number.isNaN(ad.getTime()) ? 0 : ad.getTime();
        const bt = Number.isNaN(bd.getTime()) ? 0 : bd.getTime();

        const aa = Math.abs(Number(a?.amount) || 0);
        const ba = Math.abs(Number(b?.amount) || 0);

        switch (sortOrder) {
          case 'oldest':
            return at - bt;
          case 'amount_high':
            return ba - aa;
          case 'amount_low':
            return aa - ba;
          default: // newest
            return bt - at;
        }
      });
  }, [transactions, searchTerm, filterType, sortOrder]);

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="History" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-foreground">
              Transaction History
            </h3>
          </div>
          <Button variant="outline" iconName="Download" size="sm">
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value || '')}
          />
          <Select options={transactionTypes} value={filterType} onChange={setFilterType} />
          <Select options={sortOptions} value={sortOrder} onChange={setSortOrder} />
        </div>
      </div>

      {/* Transactions */}
      <div className="divide-y divide-border">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No Transactions Found
          </div>
        ) : (
          filteredAndSortedTransactions.map((t) => {
            const amountNum = Number(t?.amount) || 0;
            const sign = amountNum < 0 ? '-' : amountNum > 0 ? '+' : '';

            return (
              <div
                key={t?.id ?? `${t?.date}-${t?.description}-${t?.amount}`}
                className="p-4 hover:bg-muted/30 transition-smooth"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconBg(amountNum)}`}>
                      <Icon
                        name={getTransactionIcon(t?.type)}
                        size={20}
                        className={getTransactionColor(amountNum)}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {t?.description || 'Transaction'}
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(t?.date)}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className={`text-lg font-semibold ${getTransactionColor(amountNum)}`}>
                    {sign}
                    {formatCurrency(amountNum)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
