'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Modal } from '../ui/Modal';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  AlertCircle,
  Lock,
  Building2,
  Copy,
  Check
} from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { currentUser, transactions, addFundsToWallet, withdrawFunds, convertNavCoinsToRupees } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'overview' | 'topup' | 'withdraw' | 'convert'>('overview');

  // Top-up Gateway State
  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [gatewayStep, setGatewayStep] = useState<'configure' | 'verify' | 'processing' | 'receipt'>('configure');
  const [upiId, setUpiId] = useState('arnav.yadav@oksbi');
  const [upiVerified, setUpiVerified] = useState(true);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardOtp, setCardOtp] = useState('482910');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [lastReceiptId, setLastReceiptId] = useState('');
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Withdrawal & Conversion State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [withdrawUpi, setWithdrawUpi] = useState('arnav.yadav@okhdfcbank');
  const [convertCoins, setConvertCoins] = useState<number>(100000);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const userTransactions = transactions.filter((t) => t.user_id === currentUser.id);

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (convertCoins < 100000) {
      setErrorMsg('Minimum conversion amount is 100,000 Nav Coins (= ₹1)');
      return;
    }
    if ((currentUser.nav_coins || 0) < convertCoins) {
      setErrorMsg(`Insufficient Nav Coins. You have ${(currentUser.nav_coins || 0).toLocaleString()} Nav Coins.`);
      return;
    }

    const ok = convertNavCoinsToRupees(convertCoins);
    if (ok) {
      const earned = Math.floor(convertCoins / 100000);
      setSuccessMsg(`Converted ${convertCoins.toLocaleString()} Nav Coins into ₹${earned} added to your Wallet balance!`);
      setTimeout(() => {
        setSuccessMsg('');
        setActiveTab('overview');
      }, 1800);
    } else {
      setErrorMsg('Conversion failed. Ensure you have at least 100,000 Nav Coins.');
    }
  };

  const handleProceedToGateway = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (topUpAmount < 50) {
      setErrorMsg('Minimum deposit amount is ₹50.');
      return;
    }
    setGatewayStep('verify');
  };

  const handleAuthorizePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setGatewayStep('processing');

    setTimeout(() => {
      const methodLabel =
        paymentMethod === 'upi'
          ? `UPI Instant (${upiId})`
          : paymentMethod === 'card'
          ? `3DS Card (${cardNumber.slice(-4)})`
          : `NetBanking (${selectedBank})`;

      const tx = addFundsToWallet(topUpAmount, methodLabel);
      const utr = `UTR${Date.now().toString().slice(-10)}`;
      setLastReceiptId(`${utr} (${tx.id})`);
      setGatewayStep('receipt');
    }, 650);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (withdrawAmount <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount.');
      return;
    }
    if (withdrawAmount > currentUser.wallet_balance) {
      setErrorMsg('Insufficient balance in wallet');
      return;
    }
    if (!withdrawUpi.includes('@')) {
      setErrorMsg('Please enter a valid UPI ID (e.g., student@oksbi)');
      return;
    }

    const success = withdrawFunds(withdrawAmount, withdrawUpi);
    if (success) {
      setSuccessMsg(`Instant IMPS/UPI Payout of ₹${withdrawAmount.toLocaleString('en-IN')} settled to ${withdrawUpi}!`);
      setTimeout(() => {
        setSuccessMsg('');
        setActiveTab('overview');
      }, 1800);
    } else {
      setErrorMsg('Withdrawal failed');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="hw Escrow & Campus Payment Gateway"
      subtitle="256-Bit Encrypted UPI, 3DS Card Checkout, and Nav Coins Exchange"
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Wallet Balance Hero Card */}
        <div className="glass rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-white/10">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Available Wallet Balance (INR)
              </span>
              <p className="text-3xl sm:text-4xl font-black mt-1 text-white">
                ₹{currentUser.wallet_balance.toLocaleString('en-IN')}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mt-2">
                <ShieldCheck size={14} />
                <span>Protected by hw Escrow Protocol</span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                Nav Coins Balance
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-amber-300">
                  {(currentUser.nav_coins || 0).toLocaleString()}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                  Nav
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Rate: 100,000 Nav Coins = ₹1.00
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setActiveTab('topup');
                setGatewayStep('configure');
                setSuccessMsg('');
                setErrorMsg('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition shadow"
            >
              <ArrowDownLeft size={14} /> Add Funds (Gateway)
            </button>
            <button
              onClick={() => {
                setActiveTab('withdraw');
                setSuccessMsg('');
                setErrorMsg('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
            >
              <ArrowUpRight size={14} /> Withdraw to UPI
            </button>
            <button
              onClick={() => {
                setActiveTab('convert');
                setSuccessMsg('');
                setErrorMsg('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition ml-auto"
            >
              <Sparkles size={14} /> Convert Nav Coins to ₹
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-4 border-b-2 whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Transaction Ledger ({userTransactions.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('topup');
              setGatewayStep('configure');
            }}
            className={`pb-2.5 px-4 border-b-2 whitespace-nowrap transition ${
              activeTab === 'topup'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Payment Gateway (Deposit)
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`pb-2.5 px-4 border-b-2 whitespace-nowrap transition ${
              activeTab === 'withdraw'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Instant UPI Payout
          </button>
          <button
            onClick={() => setActiveTab('convert')}
            className={`pb-2.5 px-4 border-b-2 whitespace-nowrap transition ${
              activeTab === 'convert'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Nav Coins Exchange
          </button>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Transaction History */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Campus Ledger
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {userTransactions.length > 0 ? (
                userTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          tx.type === 'credit' || tx.type === 'escrow_release'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
                        }`}
                      >
                        {tx.type === 'credit' || tx.type === 'escrow_release' ? (
                          <ArrowDownLeft size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {tx.description}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Ref: #{tx.id} • {new Date(tx.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-bold ${
                        tx.type === 'credit' || tx.type === 'escrow_release'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'credit' || tx.type === 'escrow_release' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-400">
                  No transactions recorded yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Multi-Step Payment Gateway */}
        {activeTab === 'topup' && (
          <div className="space-y-4">
            {gatewayStep === 'configure' && (
              <form onSubmit={handleProceedToGateway} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    1. Select Amount to Deposit (₹ INR)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2.5">
                    {[500, 1000, 2500, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTopUpAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          topUpAmount === amt
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        +₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    2. Choose Payment Gateway Rail
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition ${
                        paymentMethod === 'upi'
                          ? 'border-indigo-500 bg-indigo-500/15'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <QrCode size={18} className="text-indigo-400" />
                      <div>
                        <p className="text-xs font-bold text-white">UPI / QR</p>
                        <p className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition ${
                        paymentMethod === 'card'
                          ? 'border-indigo-500 bg-indigo-500/15'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <CreditCard size={18} className="text-indigo-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Debit / Credit</p>
                        <p className="text-[10px] text-slate-400">Visa, RuPay, Mastercard</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition ${
                        paymentMethod === 'netbanking'
                          ? 'border-indigo-500 bg-indigo-500/15'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <Building2 size={18} className="text-indigo-400" />
                      <div>
                        <p className="text-xs font-bold text-white">NetBanking</p>
                        <p className="text-[10px] text-slate-400">SBI, HDFC, ICICI, Axis</p>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
                >
                  <Lock size={14} />
                  <span>Proceed to Secure Gateway (₹{topUpAmount.toLocaleString('en-IN')})</span>
                </button>
              </form>
            )}

            {gatewayStep === 'verify' && (
              <form onSubmit={handleAuthorizePayment} className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      hw Pay Checkout • ₹{topUpAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGatewayStep('configure')}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Change Method
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="p-4 rounded-xl bg-white text-slate-900 flex flex-col items-center justify-center space-y-2">
                      {/*Crisp Deterministic SVG QR Code*/}
                      <svg viewBox="0 0 100 100" className="w-28 h-28">
                        <rect width="100" height="100" fill="#ffffff" />
                        <rect x="8" y="8" width="26" height="26" fill="none" stroke="#0f172a" strokeWidth="5" />
                        <rect x="15" y="15" width="12" height="12" fill="#0f172a" />
                        <rect x="66" y="8" width="26" height="26" fill="none" stroke="#0f172a" strokeWidth="5" />
                        <rect x="73" y="15" width="12" height="12" fill="#0f172a" />
                        <rect x="8" y="66" width="26" height="26" fill="none" stroke="#0f172a" strokeWidth="5" />
                        <rect x="15" y="73" width="12" height="12" fill="#0f172a" />
                        <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                        <rect x="52" y="18" width="6" height="12" fill="#0f172a" />
                        <rect x="40" y="34" width="18" height="6" fill="#0f172a" />
                        <rect x="12" y="44" width="18" height="6" fill="#0f172a" />
                        <rect x="44" y="46" width="12" height="12" fill="#4f46e5" />
                        <rect x="64" y="42" width="8" height="18" fill="#0f172a" />
                        <rect x="80" y="48" width="12" height="6" fill="#0f172a" />
                        <rect x="42" y="68" width="14" height="6" fill="#0f172a" />
                        <rect x="62" y="66" width="12" height="12" fill="#0f172a" />
                        <rect x="80" y="72" width="12" height="18" fill="#0f172a" />
                        <rect x="46" y="82" width="20" height="8" fill="#0f172a" />
                      </svg>
                      <span className="text-[10px] font-bold text-slate-600">
                        Scan with GPay / PhonePe / Paytm
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                          Or Enter UPI ID (VPA)
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            required
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiVerified(false);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setUpiVerified(true)}
                            className="px-2.5 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold"
                          >
                            Verify
                          </button>
                        </div>
                        {upiVerified && (
                          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Verified: {currentUser.full_name.toUpperCase()} (OKSBI)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-emerald-400 mb-1">
                          3DS Bank OTP
                        </label>
                        <input
                          type="text"
                          required
                          value={cardOtp}
                          onChange={(e) => setCardOtp(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-emerald-500/40 bg-slate-950 text-xs text-emerald-300 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">
                      Select University Partner Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white"
                    >
                      <option value="State Bank of India (SBI)">State Bank of India (SBI Campus Branch)</option>
                      <option value="HDFC Bank">HDFC Bank NetBanking</option>
                      <option value="ICICI Bank">ICICI Bank Campus</option>
                      <option value="Axis Bank">Axis Bank Direct</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={15} />
                  <span>Authorize &amp; Complete Payment of ₹{topUpAmount.toLocaleString('en-IN')}</span>
                </button>
              </form>
            )}

            {gatewayStep === 'processing' && (
              <div className="py-10 text-center space-y-3">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-sm font-bold text-white">Verifying cryptographic bank signature...</p>
                <p className="text-xs text-slate-400">Crediting hw Campus Escrow Wallet</p>
              </div>
            )}

            {gatewayStep === 'receipt' && (
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={26} />
                </div>
                <h4 className="text-base font-black text-white">
                  ₹{topUpAmount.toLocaleString('en-IN')} Added to Wallet!
                </h4>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <span>{lastReceiptId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(lastReceiptId);
                      setCopiedReceipt(true);
                      setTimeout(() => setCopiedReceipt(false), 1500);
                    }}
                    className="text-indigo-400 hover:text-white"
                  >
                    {copiedReceipt ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGatewayStep('configure');
                      setActiveTab('overview');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    View in Ledger
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Convert Nav Coins */}
        {activeTab === 'convert' && (
          <form onSubmit={handleConvert} className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles size={16} />
                <span>Nav Coins Conversion Exchange</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nav Coins are earned through challenging campus arcade mini-games. 
                Exchange rule: <strong>100,000 Nav Coins = ₹1 (INR)</strong> credited directly to your main escrow wallet.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Nav Coins to Convert
                </label>
                <span className="text-[11px] text-amber-400 font-semibold">
                  Available: {(currentUser.nav_coins || 0).toLocaleString()} Nav
                </span>
              </div>
              <input
                type="number"
                step="100000"
                min="100000"
                value={convertCoins}
                onChange={(e) => setConvertCoins(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                You will receive: <strong className="text-emerald-400">₹{Math.floor(convertCoins / 100000)}</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={(currentUser.nav_coins || 0) < convertCoins || convertCoins < 100000}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition disabled:opacity-40"
            >
              Convert {convertCoins.toLocaleString()} Nav Coins into ₹{Math.floor(convertCoins / 100000)}
            </button>
          </form>
        )}

        {/* Tab 4: Withdraw Payout */}
        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Withdrawal Amount (₹)
                </label>
                <span className="text-[11px] text-slate-400">
                  Available: ₹{currentUser.wallet_balance.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                min="100"
                max={currentUser.wallet_balance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Destination Student UPI ID (VPA)
              </label>
              <input
                type="text"
                required
                placeholder="yourname@okaxis"
                value={withdrawUpi}
                onChange={(e) => setWithdrawUpi(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={currentUser.wallet_balance < withdrawAmount || withdrawAmount <= 0}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition disabled:opacity-50"
            >
              Instant UPI Payout of ₹{withdrawAmount.toLocaleString('en-IN')}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
