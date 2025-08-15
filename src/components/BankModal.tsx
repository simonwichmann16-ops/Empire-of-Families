
import React, { useState } from 'react';
import { Player, StockState } from '../types';

interface StockRowProps {
    stock: StockState;
    ownedShares: number;
    bank: number;
    onBuy: (stockId: string, quantity: number, cost: number) => void;
    onSell: (stockId: string, quantity: number, revenue: number) => void;
    disabled: boolean;
}

const StockRow: React.FC<StockRowProps> = ({ stock, ownedShares, bank, onBuy, onSell, disabled }) => {
    const [quantity, setQuantity] = useState<number | string>(1);

    const totalCost = stock.price * Number(quantity);
    const canAfford = bank >= totalCost;
    const canSell = ownedShares >= Number(quantity);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, max: number) => {
        const value = e.target.value;
        if (value === '') {
            setQuantity('');
            return;
        }
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0) {
            setQuantity(Math.min(numValue, max));
        }
    };
    
    const PriceDisplay: React.FC<{ price: number, change: number }> = ({ price, change }) => {
        const color = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500';
        const sign = change > 0 ? '+' : '';
        return (
            <div className={`font-mono text-right`}>
                <p className="text-lg text-orange-950">${price.toFixed(2)}</p>
                <p className={`text-xs ${color}`}>
                    {sign}{(change * 100).toFixed(2)}%
                </p>
            </div>
        );
    };

    return (
        <tr className="border-b border-orange-200/50 hover:bg-orange-100/30">
            <td className="px-4 py-3 border-r border-dotted border-orange-200">
                <p className="font-bold text-orange-900">{stock.name} ({stock.id})</p>
                <p className="text-xs text-orange-700">{stock.description}</p>
            </td>
            <td className="px-4 py-3 border-r border-dotted border-orange-200">
                <PriceDisplay price={stock.price} change={stock.change} />
            </td>
            <td className="px-4 py-3 font-mono text-center text-lg text-orange-900 border-r border-dotted border-orange-200">{ownedShares.toLocaleString()}</td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e, 999999)}
                        className="w-24 bg-white border border-orange-300 rounded-md p-2 text-center font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none text-orange-900"
                        disabled={disabled}
                    />
                    <div className="flex flex-col gap-1">
                        <button onClick={() => onBuy(stock.id, Number(quantity), totalCost)} disabled={disabled || !canAfford || Number(quantity) <= 0} className="px-3 py-1 text-xs font-semibold rounded-md transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-orange-100 disabled:text-orange-400">Buy</button>
                        <button onClick={() => onSell(stock.id, Number(quantity), totalCost)} disabled={disabled || !canSell || Number(quantity) <= 0} className="px-3 py-1 text-xs font-semibold rounded-md transition-colors bg-red-600 text-white hover:bg-red-700 disabled:bg-orange-100 disabled:text-orange-400">Sell</button>
                    </div>
                </div>
            </td>
        </tr>
    );
};


interface BankModalProps {
  playerMoney: number;
  playerBank: number;
  playerPortfolio: { [stockId: string]: number };
  stocks: StockState[];
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onBuyStock: (stockId: string, quantity: number, cost: number) => void;
  onSellStock: (stockId: string, quantity: number, revenue: number) => void;
  disabled: boolean;
  onClose: () => void;
}

const BankModal: React.FC<BankModalProps> = ({ playerMoney, playerBank, playerPortfolio, stocks, onDeposit, onWithdraw, onBuyStock, onSellStock, disabled, onClose }) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'market'>('accounts');
  const [depositAmount, setDepositAmount] = useState<number | string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>('');
  
  const portfolioValue = Object.entries(playerPortfolio).reduce((sum, [stockId, quantity]) => {
    const stock = stocks.find(s => s.id === stockId);
    return sum + ((stock?.price || 0) * quantity);
  }, 0);

  const handleDepositAction = () => {
    const amount = Number(depositAmount);
    if (amount > 0) {
      onDeposit(amount);
      setDepositAmount('');
    }
  };

  const handleWithdrawAction = () => {
    const amount = Number(withdrawAmount);
    if (amount > 0) {
      onWithdraw(amount);
      setWithdrawAmount('');
    }
  };
  
    const TabButton: React.FC<{ label: string; tabName: 'accounts' | 'market'; }> = ({ label, tabName }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 font-bold text-lg rounded-t-md transition-colors ${
            activeTab === tabName ? 'bg-orange-50/50 text-sky-700' : 'bg-transparent text-orange-600 hover:bg-orange-100/50'
            }`}
        >
            {label}
        </button>
    );

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-4xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-1">
          <h2 id="bank-modal-title" className="text-2xl font-bold text-sky-600">Bank of the Empire</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close bank modal"
          >&times;</button>
        </div>
        
        <div className="flex border-b border-orange-200 mb-4">
            <TabButton label="Accounts" tabName="accounts" />
            <TabButton label="Stock Market" tabName="market" />
        </div>
        
        {activeTab === 'accounts' && (
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 -mr-2">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg border border-orange-100">
                        <p className="text-sm text-orange-600">Cash on Hand</p>
                        <p className="font-mono text-xl text-green-600">${playerMoney.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-orange-100">
                        <p className="text-sm text-orange-600">In Bank</p>
                        <p className="font-mono text-xl text-teal-600">${playerBank.toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-lg text-orange-900">Deposit Funds</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">$</span>
                            <input type="number" min="0" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Amount to deposit" className="w-full bg-white border border-orange-300 rounded-md p-3 pl-6 text-center font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none" disabled={disabled}/>
                        </div>
                        <button onClick={() => setDepositAmount(playerMoney)} disabled={disabled || playerMoney === 0} className="px-4 py-2 text-sm font-semibold rounded-md transition-colors text-center bg-orange-200 text-orange-800 hover:bg-orange-300 disabled:bg-orange-50 disabled:text-orange-400 disabled:cursor-not-allowed">Max</button>
                        <button onClick={handleDepositAction} disabled={disabled || !depositAmount || Number(depositAmount) <= 0 || Number(depositAmount) > playerMoney} className="px-6 py-2 text-sm font-semibold rounded-md transition-colors text-center bg-sky-600 text-white hover:bg-sky-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed">Deposit</button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-lg text-orange-900">Withdraw Funds</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">$</span>
                            <input type="number" min="0" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Amount to withdraw" className="w-full bg-white border border-orange-300 rounded-md p-3 pl-6 text-center font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none" disabled={disabled}/>
                        </div>
                        <button onClick={() => setWithdrawAmount(playerBank)} disabled={disabled || playerBank === 0} className="px-4 py-2 text-sm font-semibold rounded-md transition-colors text-center bg-orange-200 text-orange-800 hover:bg-orange-300 disabled:bg-orange-50 disabled:text-orange-400 disabled:cursor-not-allowed">Max</button>
                        <button onClick={handleWithdrawAction} disabled={disabled || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > playerBank} className="px-6 py-2 text-sm font-semibold rounded-md transition-colors text-center bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed">Withdraw</button>
                    </div>
                </div>
            </div>
        )}
        {activeTab === 'market' && (
            <div className="flex flex-col flex-grow overflow-hidden">
                <div className="grid grid-cols-2 gap-4 text-center mb-4 flex-shrink-0">
                    <div className="bg-white p-4 rounded-lg border border-orange-100">
                        <p className="text-sm text-orange-600">Bank Balance</p>
                        <p className="font-mono text-xl text-teal-600">${playerBank.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-orange-100">
                        <p className="text-sm text-orange-600">Portfolio Value</p>
                        <p className="font-mono text-xl text-purple-600">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-orange-800 uppercase bg-orange-100/50">
                            <tr>
                                <th scope="col" className="px-4 py-3 border-r border-dotted border-orange-200">Stock</th>
                                <th scope="col" className="px-4 py-3 text-right border-r border-dotted border-orange-200">Price</th>
                                <th scope="col" className="px-4 py-3 text-center border-r border-dotted border-orange-200">Owned</th>
                                <th scope="col" className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map(stock => (
                                <StockRow 
                                    key={stock.id}
                                    stock={stock}
                                    ownedShares={playerPortfolio[stock.id] || 0}
                                    bank={playerBank}
                                    onBuy={onBuyStock}
                                    onSell={onSellStock}
                                    disabled={disabled}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default BankModal;
