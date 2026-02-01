// src/pages/digital-wallet/components/QuickTopUp.jsx
import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { t } from "../../../utils/i18n";

const MIN_TOPUP = 5000;      // 5,000₮
const MAX_TOPUP = 500000;    // 500,000₮ (хүсвэл өөрчлөөд болно)

const quickAmounts = [5000, 10000, 20000, 50000, 100000];

const formatMNT = (value) =>
  `MNT ${Number(value || 0).toLocaleString("mn-MN")}`;

const QuickTopUp = ({ onTopUp, isLoading }) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CARD"); // CARD | PAYPAL | BANK
  const [error, setError] = useState("");

  const handleSelectQuick = (value) => {
    setError("");
    setAmount(String(value));
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, ""); // зөвхөн тоо
    setAmount(raw);
    setError("");
  };

  const validate = () => {
    const num = Number(amount || 0);

    if (!num) {
      setError("Дүнгээ оруулна уу.");
      return false;
    }
    if (num < MIN_TOPUP) {
      setError(`Хамгийн багадаа ${MIN_TOPUP.toLocaleString("mn-MN")}₮.`);
      return false;
    }
    if (num > MAX_TOPUP) {
      setError(
        `Хамгийн ихдээ ${MAX_TOPUP.toLocaleString("mn-MN")}₮ хүртэл цэнэглэнэ.`
      );
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const num = Number(amount);

    onTopUp?.({
      amount: num,                // backend рүү шууд төгрөгөөр явж байна
      method:
        method === "CARD"
          ? "Credit/Debit card"
          : method === "PAYPAL"
          ? "PayPal"
          : "Bank transfer",
    });
  };

  const numericAmount = Number(amount || 0);
  const disabled = isLoading || numericAmount < MIN_TOPUP;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick amounts */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Top Up Amount (MNT)
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {quickAmounts.map((val) => (
            <button
              type="button"
              key={val}
              onClick={() => handleSelectQuick(val)}
              className={`px-3 py-1.5 rounded-full border text-sm transition ${
                Number(amount) === val
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {val.toLocaleString("mn-MN")}₮
            </button>
          ))}
        </div>

        <Input
          type="number"
          min={MIN_TOPUP}
          max={MAX_TOPUP}
          value={amount}
          onChange={handleAmountChange}
          placeholder="Дүнгээ оруулна уу"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Хамгийн бага {MIN_TOPUP.toLocaleString("mn-MN")}₮,
          хамгийн их {MAX_TOPUP.toLocaleString("mn-MN")}₮
        </p>
        {error && (
          <p className="text-xs text-red-400 mt-1">
            {error}
          </p>
        )}
      </div>

      {/* Payment method */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground mb-2">
          Төлбөрийн хэлбэр
        </label>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setMethod("CARD")}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition ${
              method === "CARD"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="CreditCard" size={18} />
              <span>Кредит/Дебит карт</span>
            </span>
            {method === "CARD" && <Icon name="Check" size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMethod("PAYPAL")}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition ${
              method === "PAYPAL"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="Smartphone" size={18} />
              <span>PayPal (жишээ)</span>
            </span>
            {method === "PAYPAL" && <Icon name="Check" size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMethod("BANK")}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition ${
              method === "BANK"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="Banknote" size={18} />
              <span>Банкны шилжүүлэг</span>
            </span>
            {method === "BANK" && <Icon name="Check" size={18} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2 border-t border-border">
        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={disabled}
          loading={isLoading}
          iconName="Wallet"
          iconPosition="left"
        >
          {numericAmount > 0
            ? `Цэнэглэх ${formatMNT(numericAmount)}`
            : "Цэнэглэх"}
        </Button>
      </div>
    </form>
  );
};

export default QuickTopUp;
