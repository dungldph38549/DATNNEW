import React, { useState } from 'react';
import { Wallet, Plus, Minus, CreditCard, History, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Gift, ShoppingBag, Zap } from 'lucide-react';

export default function UserWallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  // Dữ liệu mẫu
  const walletBalance = 2450000;
  const transactions = [
    {
      id: 1,
      type: 'income',
      amount: 500000,
      description: 'Hoàn tiền đơn hàng #12345',
      date: '2024-03-15',
      time: '14:30'
    },
    {
      id: 2,
      type: 'expense',
      amount: 350000,
      description: 'Mua sản phẩm - Áo thun nam',
      date: '2024-03-14',
      time: '10:15'
    },
    {
      id: 3,
      type: 'income',
      amount: 1000000,
      description: 'Nạp tiền vào ví',
      date: '2024-03-13',
      time: '16:45'
    },
    {
      id: 4,
      type: 'expense',
      amount: 750000,
      description: 'Thanh toán đơn hàng #12344',
      date: '2024-03-12',
      time: '09:20'
    }
  ];

  const quickActions = [
    { icon: Plus, label: 'Nạp tiền', color: 'bg-green-500' },
    { icon: Minus, label: 'Rút tiền', color: 'bg-blue-500' },
    { icon: Gift, label: 'Voucher', color: 'bg-purple-500' },
    { icon: Zap, label: 'Flash Sale', color: 'bg-orange-500' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ví của tôi</h1>
                <p className="text-gray-500">Quản lý tài chính cá nhân</p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 mb-2">Số dư khả dụng</p>
              <h2 className="text-3xl font-bold">
                {showBalance ? formatCurrency(walletBalance) : '••••••••'}
              </h2>
            </div>
            <CreditCard className="w-8 h-8 text-blue-200" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Thu nhập tháng này</p>
              <p className="text-xl font-semibold">
                {showBalance ? formatCurrency(1500000) : '••••••••'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Chi tiêu tháng này</p>
              <p className="text-xl font-semibold">
                {showBalance ? formatCurrency(1100000) : '••••••••'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-700 text-sm font-medium">{action.label}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            {[
              { id: 'overview', label: 'Tổng quan', icon: Wallet },
              { id: 'history', label: 'Lịch sử', icon: History },
              { id: 'shopping', label: 'Mua sắm', icon: ShoppingBag }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-700 text-sm font-medium">Tổng thu nhập</p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(5200000)}
                        </p>
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-700 text-sm font-medium">Tổng chi tiêu</p>
                        <p className="text-2xl font-bold text-red-900">
                          {formatCurrency(2750000)}
                        </p>
                      </div>
                      <ArrowDownLeft className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Giao dịch gần đây</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'income' 
                              ? <ArrowUpRight className="w-5 h-5 text-green-600" />
                              : <ArrowDownLeft className="w-5 h-5 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.date} • {transaction.time}</p>
                          </div>
                        </div>
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Xuất báo cáo
                  </button>
                </div>
                
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' 
                            ? <ArrowUpRight className="w-6 h-6 text-green-600" />
                            : <ArrowDownLeft className="w-6 h-6 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date} • {transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-lg ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-500">Hoàn thành</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shopping' && (
              <div className="text-center py-8">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tính năng đang phát triển</h3>
                <p className="text-gray-500">Tính năng mua sắm sẽ sớm được cập nhật.</p>
              </div>
            )}
          </div>


          import React, { useState } from 'react';
import { Wallet, Plus, Minus, CreditCard, History, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Gift, ShoppingBag, Zap } from 'lucide-react';

export default function UserWallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  // Dữ liệu mẫu
  const walletBalance = 2450000;
  const transactions = [
    {
      id: 1,
      type: 'income',
      amount: 500000,
      description: 'Hoàn tiền đơn hàng #12345',
      date: '2024-03-15',
      time: '14:30'
    },
    {
      id: 2,
      type: 'expense',
      amount: 350000,
      description: 'Mua sản phẩm - Áo thun nam',
      date: '2024-03-14',
      time: '10:15'
    },
    {
      id: 3,
      type: 'income',
      amount: 1000000,
      description: 'Nạp tiền vào ví',
      date: '2024-03-13',
      time: '16:45'
    },
    {
      id: 4,
      type: 'expense',
      amount: 750000,
      description: 'Thanh toán đơn hàng #12344',
      date: '2024-03-12',
      time: '09:20'
    }
  ];

  const quickActions = [
    { icon: Plus, label: 'Nạp tiền', color: 'bg-green-500' },
    { icon: Minus, label: 'Rút tiền', color: 'bg-blue-500' },
    { icon: Gift, label: 'Voucher', color: 'bg-purple-500' },
    { icon: Zap, label: 'Flash Sale', color: 'bg-orange-500' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ví của tôi</h1>
                <p className="text-gray-500">Quản lý tài chính cá nhân</p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 mb-2">Số dư khả dụng</p>
              <h2 className="text-3xl font-bold">
                {showBalance ? formatCurrency(walletBalance) : '••••••••'}
              </h2>
            </div>
            <CreditCard className="w-8 h-8 text-blue-200" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Thu nhập tháng này</p>
              <p className="text-xl font-semibold">
                {showBalance ? formatCurrency(1500000) : '••••••••'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Chi tiêu tháng này</p>
              <p className="text-xl font-semibold">
                {showBalance ? formatCurrency(1100000) : '••••••••'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-700 text-sm font-medium">{action.label}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            {[
              { id: 'overview', label: 'Tổng quan', icon: Wallet },
              { id: 'history', label: 'Lịch sử', icon: History },
              { id: 'shopping', label: 'Mua sắm', icon: ShoppingBag }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-700 text-sm font-medium">Tổng thu nhập</p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(5200000)}
                        </p>
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-700 text-sm font-medium">Tổng chi tiêu</p>
                        <p className="text-2xl font-bold text-red-900">
                          {formatCurrency(2750000)}
                        </p>
                      </div>
                      <ArrowDownLeft className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Giao dịch gần đây</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'income' 
                              ? <ArrowUpRight className="w-5 h-5 text-green-600" />
                              : <ArrowDownLeft className="w-5 h-5 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.date} • {transaction.time}</p>
                          </div>
                        </div>
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Xuất báo cáo
                  </button>
                </div>
                
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' 
                            ? <ArrowUpRight className="w-6 h-6 text-green-600" />
                            : <ArrowDownLeft className="w-6 h-6 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date} • {transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-lg ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-500">Hoàn thành</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shopping' && (
              <div className="text-center py-8">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tính năng đang phát triển</h3>
                <p className="text-gray-500">Tính năng mua sắm sẽ sớm được cập nhật.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
        </div>
      </div>
    </div>
  );
}
