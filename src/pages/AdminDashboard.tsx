import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency, formatDate } from '@/utils/format'
import {
  DollarSign, LogOut, Users, CheckCircle, XCircle, Clock,
  BarChart3, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Search, Shield, FileText, Wallet
} from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  userId: string
  userName: string
  userEmail: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  totalSpent: number
  totalReceived: number
  transactionCount: number
  joinDate: string
}

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@company.com', role: 'user', totalSpent: 1245.50, totalReceived: 1500.00, transactionCount: 24, joinDate: '2026-01-15' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@company.com', role: 'user', totalSpent: 890.25, totalReceived: 1000.00, transactionCount: 18, joinDate: '2026-02-20' },
  { id: 'u3', name: 'Carol White', email: 'carol@company.com', role: 'user', totalSpent: 2100.00, totalReceived: 2500.00, transactionCount: 32, joinDate: '2026-03-10' },
  { id: 'u4', name: 'David Brown', email: 'david@company.com', role: 'user', totalSpent: 567.80, totalReceived: 800.00, transactionCount: 12, joinDate: '2026-04-05' },
]

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Office stationery purchase', amount: 45.50, type: 'expense', category: 'Office Supplies', date: '2026-06-28', status: 'pending', userId: 'u1', userName: 'Alice Johnson', userEmail: 'alice@company.com' },
  { id: '2', description: 'Client lunch meeting', amount: 78.25, type: 'expense', category: 'Meals', date: '2026-06-27', status: 'pending', userId: 'u2', userName: 'Bob Smith', userEmail: 'bob@company.com' },
  { id: '3', description: 'Monthly allowance', amount: 500.00, type: 'income', category: 'Other', date: '2026-06-25', status: 'approved', userId: 'u1', userName: 'Alice Johnson', userEmail: 'alice@company.com' },
  { id: '4', description: 'Taxi to airport', amount: 32.00, type: 'expense', category: 'Transport', date: '2026-06-24', status: 'approved', userId: 'u3', userName: 'Carol White', userEmail: 'carol@company.com' },
  { id: '5', description: 'Printer ink cartridges', amount: 89.99, type: 'expense', category: 'Office Supplies', date: '2026-06-22', status: 'pending', userId: 'u4', userName: 'David Brown', userEmail: 'david@company.com' },
  { id: '6', description: 'Team building event', amount: 245.00, type: 'expense', category: 'Marketing', date: '2026-06-20', status: 'approved', userId: 'u2', userName: 'Bob Smith', userEmail: 'bob@company.com' },
  { id: '7', description: 'Software license renewal', amount: 299.00, type: 'expense', category: 'Equipment', date: '2026-06-18', status: 'rejected', userId: 'u3', userName: 'Carol White', userEmail: 'carol@company.com' },
  { id: '8', description: 'Quarterly bonus', amount: 1000.00, type: 'income', category: 'Other', date: '2026-06-15', status: 'approved', userId: 'u1', userName: 'Alice Johnson', userEmail: 'alice@company.com' },
]

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'users'>('overview')
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const pendingTransactions = transactions.filter(t => t.status === 'pending')

  const totalBalance = transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount
  }, 5000)

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)

  const handleApprove = (id: string) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status: 'approved' as const } : t))
  }

  const handleReject = (id: string) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status: 'rejected' as const } : t))
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense' && t.status === 'approved')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const categoryData = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const maxCategory = categoryData.length > 0 ? categoryData[0][1] : 1

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Petty Cash</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </span>
              </div>
              <span className="text-sm text-slate-700 font-medium">{user?.displayName || user?.email}</span>
              <span className="text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded-md font-medium">Admin</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 -mb-px">
            {[
              { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
              { id: 'transactions' as const, label: 'Transactions', icon: FileText },
              { id: 'users' as const, label: 'Users', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'transactions' && pendingTransactions.length > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {pendingTransactions.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">Total Balance</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalBalance)}</p>
              </div>

              <div className="card p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">Total Income</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
              </div>

              <div className="card p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">Total Expenses</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
              </div>

              <div className="card p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">Active Users</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{MOCK_USERS.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Approvals */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Pending Approvals
                  </h2>
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                    {pendingTransactions.length}
                  </span>
                </div>
                <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
                  {pendingTransactions.length === 0 ? (
                    <div className="p-8 text-center">
                      <CheckCircle className="w-10 h-10 text-emerald-200 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">All caught up!</p>
                    </div>
                  ) : (
                    pendingTransactions.map((tx) => (
                      <div key={tx.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{tx.description}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {tx.userName} &middot; {tx.category} &middot; {formatDate(tx.date)}
                            </p>
                            <p className="text-sm font-bold text-red-600 mt-1">{formatCurrency(tx.amount)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(tx.id)}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(tx.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-900">Expense Categories</h2>
                </div>
                <div className="p-5 space-y-4">
                  {categoryData.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">No approved expenses yet</p>
                  ) : (
                    categoryData.map(([category, amount]) => (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-slate-700">{category}</span>
                          <span className="text-sm font-semibold text-slate-900">{formatCurrency(amount)}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full transition-all duration-500"
                            style={{ width: `${(amount / maxCategory) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="input-field w-auto pr-8"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Transaction</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">User</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Category</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Amount</th>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </div>
                            <span className="text-sm font-medium text-slate-900">{tx.description}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm text-slate-900">{tx.userName}</p>
                            <p className="text-xs text-slate-400">{tx.userEmail}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-600">{tx.category}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-600">{formatDate(tx.date)}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : tx.status === 'pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {tx.status === 'pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprove(tx.id)}
                                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(tx.id)}
                                className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_USERS.map((u) => (
                <div key={u.id} className="card p-5 card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-700">{u.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-lg font-bold text-red-600">{formatCurrency(u.totalSpent)}</p>
                      <p className="text-xs text-slate-400">Spent</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-lg font-bold text-emerald-600">{formatCurrency(u.totalReceived)}</p>
                      <p className="text-xs text-slate-400">Received</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{u.transactionCount} transactions</span>
                    <span>Since {formatDate(u.joinDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
