// src/pages/digital-wallet/components/TransactionHistory.jsx
import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionHistory = ({ transactions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // ✅ Хуудаслалтын тохиргоо
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Туршиж үзэхийн тулд 5 болгов. (Зураг дээр 10 гүйлгээ байгаа тул 2 хуудас үүснэ)

  const transactionTypes = [
    { value: 'all', label: 'Бүх гүйлгээ' },
    { value: 'topup', label: 'Цэнэглэлт' },
    { value: 'booking', label: 'Захиалга' },
    { value: 'refund', label: 'Буцаалт' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Сүүлийнх нь эхэндээ' },
    { value: 'oldest', label: 'Эхнийх нь эхэндээ' },
    { value: 'amount_high', label: 'Дүн: Ихээс бага руу' },
    { value: 'amount_low', label: 'Дүн: Багаас их рүү' },
  ];

  const formatCurrency = (amount) => {
    const n = Number(amount) || 0;
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
    }).format(Math.abs(n));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('mn-MN', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(d);
  };

  const getTransactionIcon = (type) => {
    if (type === 'topup') return 'Plus';
    if (type === 'booking') return 'Gamepad2';
    if (type === 'refund') return 'RotateCcw';
    return 'DollarSign';
  };

  const getTransactionColor = (amount) => {
    const n = Number(amount) || 0;
    return n < 0 ? 'text-destructive' : n > 0 ? 'text-success' : 'text-foreground';
  };

  // 1. Шүүлтүүр ба Эрэмбэлэлт
  const filteredAndSorted = useMemo(() => {
    const term = (searchTerm || '').toLowerCase();
    return (transactions || [])
      .filter((t) => {
        const desc = (t?.description || '').toLowerCase();
        const matchesSearch = !term || desc.includes(term);
        const matchesType = filterType === 'all' || t?.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const ad = new Date(a?.date).getTime() || 0;
        const bd = new Date(b?.date).getTime() || 0;
        return sortOrder === 'oldest' ? ad - bd : bd - ad;
      });
  }, [transactions, searchTerm, filterType, sortOrder]);

  // ✅ 2. Хуудаслалтын тооцоолол
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentTransactions = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return filteredAndSorted.slice(firstIndex, lastIndex);
  }, [filteredAndSorted, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Хайлт хийхэд 1-р хуудас руу буцна
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="History" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Гүйлгээний түүх</h3>
          </div>
          <Button variant="outline" iconName="Download" size="sm">Татах</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input type="search" placeholder="Хайх..." value={searchTerm} onChange={handleSearch} />
          <Select options={transactionTypes} value={filterType} onChange={(v) => {setFilterType(v); setCurrentPage(1);}} />
          <Select options={sortOptions} value={sortOrder} onChange={setSortOrder} />
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border min-h-[300px]">
        {currentTransactions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">Гүйлгээ олдсонгүй</div>
        ) : (
          currentTransactions.map((t, idx) => {
            const amountNum = Number(t?.amount) || 0;
            return (
              <div key={t.id || idx} className="p-4 hover:bg-muted/30 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted`}>
                    <Icon name={getTransactionIcon(t.type)} size={20} className={getTransactionColor(amountNum)} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{t.description}</h4>
                    <div className="text-sm text-muted-foreground">{formatDate(t.date)}</div>
                  </div>
                </div>
                <div className={`text-lg font-semibold ${getTransactionColor(amountNum)}`}>
                  {amountNum > 0 ? '+' : ''}{formatCurrency(amountNum)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ✅ 3. Хуудаслалтын удирдлага (Pagination) */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
        <div className="text-sm text-muted-foreground">
          Нийт: <span className="font-medium text-foreground">{totalItems}</span>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-md disabled:opacity-30 hover:bg-muted"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>

            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-md disabled:opacity-30 hover:bg-muted"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;