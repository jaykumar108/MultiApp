import React, { useState, useEffect } from 'react';
import { Plus, IndianRupee, Calendar, Tag, TrendingUp, TrendingDown, Edit3, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'food', label: 'Food & Dining', color: 'bg-orange-500' },
    { id: 'transport', label: 'Transportation', color: 'bg-blue-500' },
    { id: 'entertainment', label: 'Entertainment', color: 'bg-purple-500' },
    { id: 'shopping', label: 'Shopping', color: 'bg-pink-500' },
    { id: 'bills', label: 'Bills & Utilities', color: 'bg-red-500' },
    { id: 'health', label: 'Health & Medical', color: 'bg-green-500' },
    { id: 'other', label: 'Other', color: 'bg-gray-500' }
  ];

  // Load expenses from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expense = {
        id: Date.now(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        createdAt: new Date().toISOString()
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({
        description: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.category === filter;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = categories.map(category => {
    const total = expenses
      .filter(expense => expense.category === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { ...category, total };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-black">₹{totalExpenses.toFixed(2)}</p>
              </div>
              <div className="bg-black p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-black">₹{monthlyExpenses.toFixed(2)}</p>
              </div>
              <div className="bg-black p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-black">{expenses.length}</p>
              </div>
              <div className="bg-black p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IndianRupee className="w-6 h-6 mr-2" />
                Add Expense
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="What did you spend on?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="₹0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
              <Button onClick={addExpense} className="w-full">
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryTotals.map(category => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                      <span className="text-sm text-gray-700">{category.label}</span>
                    </div>
                    <span className="text-sm font-medium text-black">₹{category.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Expenses</CardTitle>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <IndianRupee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No expenses yet</p>
                  <p className="text-gray-400 text-sm mt-2">Add your first expense to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredExpenses.map(expense => {
                    const category = categories.find(c => c.id === expense.category);
                    return (
                      <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                            <Tag className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{expense.description}</p>
                            <p className="text-sm text-gray-500">{category.label} • {expense.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-black">₹{expense.amount.toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExpense(expense.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;