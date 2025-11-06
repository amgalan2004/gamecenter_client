import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WalletBalance from './components/WalletBalance';
import QuickTopUp from './components/QuickTopUp';
import TransactionHistory from './components/TransactionHistory';
import SpendingAnalytics from './components/SpendingAnalytics';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { t, formatCurrency, convertToMNT } from '../../utils/i18n';

const DigitalWallet = () => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const navigate = useNavigate();

  // Mock wallet data - converted to MNT
  const [walletData, setWalletData] = useState({
    balance: convertToMNT(127.50), // ₮357,000
    recentChange: {
      amount: convertToMNT(25.00), // ₮70,000
      period: t('today')
    }
  });

  // Mock transaction data - Mongolia specific
  const transactions = [
    {
      id: 'txn_001',
      type: 'topup',
      description: t('wallet.topup'),
      amount: convertToMNT(50.00), // ₮140,000
      date: '2025-01-15T10:30:00Z',
      status: t('completed'),
      method: t('credit.card'),
      reference: 'TOP001'
    },
    {
      id: 'txn_002',
      type: 'booking',
      description: t('gaming.session') + ' - Cyber Arena Ulaanbaatar',
      amount: -convertToMNT(24.00), // -₮67,200
      date: '2025-01-15T14:15:00Z',
      status: t('completed'),
      center: 'Cyber Arena Ulaanbaatar',
      reference: 'BKG002'
    },
    {
      id: 'txn_003',
      type: 'booking',
      description: t('gaming.session') + ' - GameZone Elite',
      amount: -convertToMNT(18.50), // -₮51,800
      date: '2025-01-14T16:45:00Z',
      status: t('completed'),
      center: 'GameZone Elite',
      reference: 'BKG003'
    },
    {
      id: 'txn_004',
      type: 'refund',
      description: t('booking.cancellation.refund'),
      amount: convertToMNT(15.00), // ₮42,000
      date: '2025-01-14T09:20:00Z',
      status: t('completed'),
      center: 'Elite Gaming Hub',
      reference: 'REF004'
    },
    {
      id: 'txn_005',
      type: 'topup',
      description: t('wallet.topup'),
      amount: convertToMNT(100.00), // ₮280,000
      date: '2025-01-13T11:00:00Z',
      status: t('completed'),
      method: 'PayPal',
      reference: 'TOP005'
    },
    {
      id: 'txn_006',
      type: 'booking',
      description: t('gaming.session') + ' - Neon Gaming Hub',
      amount: -convertToMNT(32.00), // -₮89,600
      date: '2025-01-12T19:30:00Z',
      status: t('completed'),
      center: 'Neon Gaming Hub',
      reference: 'BKG006'
    },
    {
      id: 'txn_007',
      type: 'booking',
      description: t('gaming.session') + ' - Cyber Arena Ulaanbaatar',
      amount: -convertToMNT(28.00), // -₮78,400
      date: '2025-01-11T15:15:00Z',
      status: t('completed'),
      center: 'Cyber Arena Ulaanbaatar',
      reference: 'BKG007'
    },
    {
      id: 'txn_008',
      type: 'topup',
      description: t('wallet.topup'),
      amount: convertToMNT(75.00), // ₮210,000
      date: '2025-01-10T08:45:00Z',
      status: t('pending'),
      method: t('bank.transfer'),
      reference: 'TOP008'
    }
  ];

  // Mock analytics data - converted to MNT
  const analyticsData = {
    totalSpent: convertToMNT(485.50), // ₮1,359,400
    totalBookings: 24,
    avgPerBooking: convertToMNT(20.23), // ₮56,644
    hoursPlayed: 96,
    monthly: [
      { month: 'Aug', amount: convertToMNT(65.50) },
      { month: 'Sep', amount: convertToMNT(89.25) },
      { month: 'Oct', amount: convertToMNT(124.75) },
      { month: 'Nov', amount: convertToMNT(98.50) },
      { month: 'Dec', amount: convertToMNT(107.50) },
      { month: 'Jan', amount: convertToMNT(142.75) }
    ],
    categories: [
      { name: 'Тоглоомын сешн', amount: convertToMNT(285.50), percentage: 58.8 },
      { name: 'Премиум цагууд', amount: convertToMNT(125.00), percentage: 25.7 },
      { name: 'Тэмцээний бүртгэл', amount: convertToMNT(45.00), percentage: 9.3 },
      { name: 'Төхөөрөмжийн түрээс', amount: convertToMNT(30.00), percentage: 6.2 }
    ],
    centers: [
      { name: 'Cyber Arena Ulaanbaatar', amount: convertToMNT(156.00), visits: 8, percentage: 32.1 },
      { name: 'GameZone Elite', amount: convertToMNT(98.50), visits: 5, percentage: 20.3 },
      { name: 'Neon Gaming Hub', amount: convertToMNT(87.25), visits: 4, percentage: 18.0 },
      { name: 'Digital Paradise', amount: convertToMNT(73.75), visits: 3, percentage: 15.2 },
      { name: 'Esports Arena Pro', amount: convertToMNT(70.00), visits: 4, percentage: 14.4 }
    ]
  };

  const viewTabs = [
    { id: 'overview', label: t('overview'), icon: 'LayoutDashboard' },
    { id: 'transactions', label: t('transactions'), icon: 'Receipt' },
    { id: 'analytics', label: t('analytics'), icon: 'BarChart3' }
  ];

  const handleTopUp = async (topUpData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setWalletData(prev => ({
        ...prev,
        balance: prev?.balance + topUpData?.amount,
        recentChange: {
          amount: topUpData?.amount,
          period: t('just.now')
        }
      }));
      
      setIsLoading(false);
      setIsTopUpModalOpen(false);
      
      // Show success message (in real app, use toast notification)
      alert(`Амжилттай ${formatCurrency(topUpData?.amount)} түрийвчтээ нэмэгдлээ!`);
    }, 2000);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'book': navigate('/gaming-center-map');
        break;
      case 'history': navigate('/booking-history');
        break;
      case 'topup':
        setIsTopUpModalOpen(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.title = t('digital.wallet') + ' - GameCenter Connect';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('digital.wallet')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('manage.funds')}
              </p>
            </div>
            <div className="hidden md:flex space-x-3">
              <Button
                variant="outline"
                onClick={() => handleQuickAction('book')}
                iconName="Gamepad2"
                iconPosition="left"
              >
                {t('book.session')}
              </Button>
              <Button
                variant="default"
                onClick={() => handleQuickAction('topup')}
                iconName="Plus"
                iconPosition="left"
              >
                {t('top.up.wallet')}
              </Button>
            </div>
          </div>

          {/* Mobile Quick Actions */}
          <div className="md:hidden mb-6">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => handleQuickAction('book')}
                iconName="Gamepad2"
                size="sm"
                className="flex-col h-16 space-y-1"
              >
                <span className="text-xs">{t('book')}</span>
              </Button>
              <Button
                variant="default"
                onClick={() => handleQuickAction('topup')}
                iconName="Plus"
                size="sm"
                className="flex-col h-16 space-y-1"
              >
                <span className="text-xs">{t('top.up')}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickAction('history')}
                iconName="History"
                size="sm"
                className="flex-col h-16 space-y-1"
              >
                <span className="text-xs">{t('history')}</span>
              </Button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex space-x-1 mb-8 bg-muted/30 p-1 rounded-lg">
            {viewTabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveView(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-smooth flex-1 justify-center ${
                  activeView === tab?.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span className="font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Content Based on Active View */}
          {activeView === 'overview' && (
            <div className="space-y-8">
              {/* Wallet Balance */}
              <WalletBalance
                balance={walletData?.balance}
                recentChange={walletData?.recentChange}
                onTopUp={() => setIsTopUpModalOpen(true)}
              />

              {/* Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">{t('recent.activity')}</h2>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveView('transactions')}
                      iconName="ArrowRight"
                      iconPosition="right"
                      size="sm"
                    >
                      {t('view.all')}
                    </Button>
                  </div>
                  <div className="bg-card border border-border rounded-lg divide-y divide-border">
                    {transactions?.slice(0, 5)?.map((transaction) => (
                      <div key={transaction?.id} className="p-4 hover:bg-muted/30 transition-smooth">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction?.type === 'topup' ? 'bg-success/20' :
                              transaction?.type === 'refund' ? 'bg-warning/20' : 'bg-primary/20'
                            }`}>
                              <Icon 
                                name={transaction?.type === 'topup' ? 'Plus' : 
                                      transaction?.type === 'refund' ? 'RotateCcw' : 'Gamepad2'} 
                                size={16} 
                                className={
                                  transaction?.type === 'topup' || transaction?.amount > 0 ? 'text-success' : 'text-destructive'
                                }
                              />
                            </div>
                            <div>
                              <div className="font-medium text-foreground text-sm">{transaction?.description}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(transaction.date)?.toLocaleDateString('mn-MN')}
                              </div>
                            </div>
                          </div>
                          <div className={`font-semibold ${
                            transaction?.amount > 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {transaction?.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction?.amount))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">{t('quick.stats')}</h2>
                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Icon name="Calendar" size={20} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{t('this.month')}</div>
                            <div className="text-sm text-muted-foreground">{t('gaming.expenses')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-foreground">{formatCurrency(convertToMNT(142.75))}</div>
                          <div className="text-sm text-success">+12% өмнөх сараас</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                            <Icon name="Clock" size={20} className="text-accent" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{t('hours.played')}</div>
                            <div className="text-sm text-muted-foreground">Энэ сар</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-foreground">28ц</div>
                          <div className="text-sm text-muted-foreground">{t('avg.per.week')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                            <Icon name="MapPin" size={20} className="text-success" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{t('favorite.center')}</div>
                            <div className="text-sm text-muted-foreground">{t('most.visited')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">CyberArena</div>
                          <div className="text-sm text-muted-foreground">8 {t('visits')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'transactions' && (
            <TransactionHistory transactions={transactions} />
          )}

          {activeView === 'analytics' && (
            <SpendingAnalytics analyticsData={analyticsData} />
          )}

          {/* Top-up Modal */}
          {isTopUpModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-background border border-border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">{t('top.up.wallet')}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsTopUpModalOpen(false)}
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>
                <div className="p-4">
                  <QuickTopUp
                    onTopUp={handleTopUp}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DigitalWallet;