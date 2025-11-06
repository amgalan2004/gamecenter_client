import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuickTopUp = ({ onTopUp, isLoading }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const predefinedAmounts = [10, 25, 50, 100, 200];
  const minAmount = 5;
  const maxAmount = 500;

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'paypal', name: 'PayPal', icon: 'Smartphone' },
    { id: 'bank', name: 'Bank Transfer', icon: 'Building2' }
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e?.target?.value;
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getSelectedAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  const isValidAmount = () => {
    const amount = getSelectedAmount();
    return amount >= minAmount && amount <= maxAmount;
  };

  const handleTopUp = () => {
    if (isValidAmount()) {
      onTopUp({
        amount: getSelectedAmount(),
        method: paymentMethod
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Plus" size={20} className="text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Top Up Wallet</h3>
      </div>
      {/* Predefined Amounts */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          Quick Select Amount
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {predefinedAmounts?.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? 'default' : 'outline'}
              onClick={() => handleAmountSelect(amount)}
              className="h-12"
            >
              ${amount}
            </Button>
          ))}
        </div>
      </div>
      {/* Custom Amount */}
      <div className="mb-6">
        <Input
          label="Custom Amount"
          type="number"
          placeholder="Enter amount"
          value={customAmount}
          onChange={handleCustomAmountChange}
          min={minAmount}
          max={maxAmount}
          description={`Minimum $${minAmount}, Maximum $${maxAmount}`}
          error={customAmount && !isValidAmount() ? 
            `Amount must be between $${minAmount} and $${maxAmount}` : ''}
        />
      </div>
      {/* Payment Methods */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          Payment Method
        </label>
        <div className="space-y-2">
          {paymentMethods?.map((method) => (
            <button
              key={method?.id}
              onClick={() => setPaymentMethod(method?.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-smooth ${
                paymentMethod === method?.id
                  ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 text-foreground'
              }`}
            >
              <Icon name={method?.icon} size={20} />
              <span className="font-medium">{method?.name}</span>
              {paymentMethod === method?.id && (
                <Icon name="Check" size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Security Notice */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-success mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Secure Payment</h4>
            <p className="text-sm text-muted-foreground">
              Your payment information is encrypted and secure. We use industry-standard SSL encryption.
            </p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="default"
          onClick={handleTopUp}
          disabled={!isValidAmount() || isLoading}
          loading={isLoading}
          iconName="CreditCard"
          iconPosition="left"
          className="flex-1"
        >
          Top Up ${getSelectedAmount()?.toFixed(2)}
        </Button>
        <Button
          variant="outline"
          iconName="X"
          className="px-4"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default QuickTopUp;