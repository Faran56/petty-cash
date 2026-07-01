import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate } from '../utils/format'
import {
  DollarSign, Plus, LogOut, Receipt, TrendingUp, TrendingDown,
  Wallet, Calendar, Tag, X, Search, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
}

const CATEGORIES = [
  'Office Supplies', 'Travel', 'Meals', 'Transport', 'Utilities',
  'Marketing', 'Equipment', 'Maintenance', 'Other'
]

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Office stationery purchase', amount: 45.50, type: 'expense', category: 'Office Supplies', date: '2026-06-28', status: 'approved' },
  { id: '2', description: 'Client lunch meeting', amount: 78.25, type: 'expense', category: 'Meals', date: '2026-06-27', status: 'pending' },
  { id: '3', description: 'Monthly allowance', amount: 500.00, type: 'income', category: 'Other', date: '2026-06-25', status: 'approved' },
  { id: '4', description: 'Taxi to airport', amount: 32.00, type: 'expense', category: 'Transport', date: '2026-06-24', status: 'approved' },
  { id: '5', description: 'Printer ink cartridges', amount: 89.99, type: 'expense', category: 'Office Supplies', date: '2026-06-22', status: 'pending' },
  { id: '6', description: 'Team building event', amount: 245.00, type: 'expense', category: 'Marketing', date: '2026-06-20', status: 'approved' },
]

export function UserDashboard() {
  const { user, logout } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const [newTx, setNewTx] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: 'Office Supplies',
    date: new Date().toISOString().split('T')[0],
  })

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || tx.type === filterType
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const totalBalance = transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount
  }, 1000)

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const pendingCount = transactions.filter(t => t.status === 'pending').length

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(newTx.amount)
    if (!newTx.description || isNaN(amount) || amount <= 0) return

    const transaction: Transaction = {
      id: Date.now().toString(),
      description: newTx.description,
      amount,
      type: newTx.type,
      category: newTx.category,
      date: newTx.date,
      status: 'pending',
    }

    setTransactions([transaction, ...transactions])
    setShowAddModal(false)
    setNewTx({
      description: '',
      amount: '',
      type: 'expense',
      category: 'Office Supplies',
      date: new Date().toISOString().split('T')[0],
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Petty Cash</h1>
              <p className="text-xs text-slate-400">User Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-700">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm text-slate-700 font-medium">{user?.displayName || user?.email}</span>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Balance</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalBalance)}</p>
            <p className="text-xs text-slate-400 mt-1">Available funds</p>
          </div>

          <div className="card p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Income</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-slate-400 mt-1">Total received</p>
          </div>

          <div className="card p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Expenses</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            <p className="text-xs text-slate-400 mt-1">Total spent</p>
          </div>

          <div className="card p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Pending</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-xs text-slate-400 mt-1">Awaiting approval</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="input-field w-auto pr-8"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
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
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
            <span className="text-xs text-slate-400">{filteredTransactions.length} results</span>
          </div>

          <div className="divide-y divide-slate-50">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'income'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {tx.category}
                          </span>
                          <span className="text-xs text-slate-300">|</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(tx.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        tx.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : tx.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">New Transaction</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: 'expense' })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      newTx.type === 'expense'
                        ? 'bg-red-50 text-red-700 border-2 border-red-200'
                        : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: 'income' })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      newTx.type === 'income'
                        ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <input
                  type="text"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  placeholder="What was this for?"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    placeholder="0.00"
                    className="input-field pl-8"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={newTx.category}
                  onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                  className="input-field"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                <input
                  type="date"
                  value={newTx.date}
                  onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
