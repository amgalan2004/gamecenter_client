import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionHistory = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const transactionTypes = [
    { value: 'all', label: 'All Transactions' },
    { value: 'topup', label: 'Top-ups' },
    { value: 'booking', label: 'Bookings' },
    { value: 'refund', label: 'Refunds' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount_high', label: 'Amount: High to Low' },
    { value: 'amount_low', label: 'Amount: Low to High' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(Math.abs(amount));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'topup': return 'Plus';
      case 'booking': return 'Gamepad2';
      case 'refund': return 'RotateCcw';
      default: return 'DollarSign';
    }
  };

  const getTransactionColor = (type, amount) => {
    if (type === 'refund' || amount > 0) return 'text-success';
    if (type === 'booking' || amount < 0) return 'text-destructive';
    return 'text-foreground';
  };

  const filteredAndSortedTransactions = transactions?.filter(transaction => {
      const matchesSearch = transaction?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           transaction?.reference?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesType = filterType === 'all' || transaction?.type === filterType;
      return matchesSearch && matchesType;
    })?.sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'amount_high':
          return Math.abs(b?.amount) - Math.abs(a?.amount);
        case 'amount_low':
          return Math.abs(a?.amount) - Math.abs(b?.amount);
        default: // newest
          return new Date(b.date) - new Date(a.date);
      }
    });

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="History" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
          </div>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            size="sm"
          >
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
          <Select
            options={transactionTypes}
            value={filterType}
            onChange={setFilterType}
            placeholder="Filter by type"
          />
          <Select
            options={sortOptions}
            value={sortOrder}
            onChange={setSortOrder}
            placeholder="Sort by"
          />
        </div>
      </div>
      {/* Transaction List */}
      <div className="divide-y divide-border">
        {filteredAndSortedTransactions?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Receipt" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Transactions Found</h4>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all' ?'Try adjusting your search or filter criteria' :'Your transaction history will appear here'
              }
            </p>
          </div>
        ) : (
          filteredAndSortedTransactions?.map((transaction) => (
            <div key={transaction?.id} className="p-4 hover:bg-muted/30 transition-smooth">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction?.type === 'topup' ? 'bg-success/20' :
                    transaction?.type === 'refund' ? 'bg-warning/20' : 'bg-primary/20'
                  }`}>
                    <Icon 
                      name={getTransactionIcon(transaction?.type)} 
                      size={20} 
                      className={getTransactionColor(transaction?.type, transaction?.amount)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{transaction?.description}</h4>
                      {transaction?.status === 'pending' && (
                        <span className="px-2 py-1 text-xs font-medium bg-warning/20 text-warning rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{formatDate(transaction?.date)}</span>
                      {transaction?.reference && (
                        <span className="font-mono">#{transaction?.reference}</span>
                      )}
                      {transaction?.center && (
                        <span>{transaction?.center}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getTransactionColor(transaction?.type, transaction?.amount)}`}>
                    {transaction?.amount > 0 ? '+' : ''}{formatCurrency(transaction?.amount)}
                  </div>
                  {transaction?.method && (
                    <div className="text-sm text-muted-foreground">{transaction?.method}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Load More */}
      {filteredAndSortedTransactions?.length > 0 && (
        <div className="p-4 border-t border-border text-center">
          <Button variant="ghost" iconName="ChevronDown" iconPosition="right">
            Load More Transactions
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;