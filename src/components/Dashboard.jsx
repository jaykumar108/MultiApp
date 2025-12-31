import React from 'react';
import { CheckSquare, IndianRupee, MessageCircle, TrendingUp, Users, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const stats = [
    { label: 'Total Tasks', value: '4', icon: CheckSquare, color: 'bg-indigo-500' },
    { label: 'Total Expenses', value: '₹34', icon: IndianRupee, color: 'bg-purple-500' },
    { label: 'Chat Messages', value: '6', icon: MessageCircle, color: 'bg-indigo-600' },
    { label: 'Productivity', value: '87%', icon: TrendingUp, color: 'bg-purple-600' },
  ];

  const features = [
    {
      title: 'Todo Management',
      description: 'Organize your tasks efficiently with our intuitive todo system',
      icon: CheckSquare,
      color: 'bg-purple-500',
    },
    {
      title: 'Expense Tracking',
      description: 'Keep track of your spending and manage your budget effectively',
      icon: IndianRupee,
      color: 'bg-purple-500',
    },
    {
      title: 'AI Chat Assistant',
      description: 'Get help and answers from our intelligent chat bot powered by Google Gemini',
      icon: MessageCircle,
      color: 'bg-purple-600',
    },
  ];

  // Chart data
  const taskTrendData = [
    { day: 'Mon', completed: 12, pending: 5 },
    { day: 'Tue', completed: 15, pending: 8 },
    { day: 'Wed', completed: 10, pending: 6 },
    { day: 'Thu', completed: 18, pending: 4 },
    { day: 'Fri', completed: 14, pending: 7 },
    { day: 'Sat', completed: 8, pending: 3 },
    { day: 'Sun', completed: 6, pending: 2 },
  ];

  const expenseData = [
    { category: 'Food', amount: 450 },
    { category: 'Transport', amount: 200 },
    { category: 'Shopping', amount: 350 },
    { category: 'Bills', amount: 180 },
    { category: 'Others', amount: 54 },
  ];

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "#6366f1",
    },
    pending: {
      label: "Pending",
      color: "#a855f7",
    },
    amount: {
      label: "Amount",
      color: "#8b5cf6",
    },
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600">
            Welcome to Task Manager
          </h2>
        </div>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Your all-in-one productivity suite featuring todo management, expense tracking, and AI-powered assistance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-purple-100"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-indigo-600">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-2 sm:p-3 rounded-lg shadow-lg`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Task Trend Chart */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-indigo-600">Task Completion Trend</CardTitle>
            <CardDescription>Weekly task completion overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Chart */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-indigo-600">Expense Breakdown</CardTitle>
            <CardDescription>Spending by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="amount"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 group transform hover:scale-105 border-purple-100"
            >
              <CardContent className="p-4 sm:p-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-indigo-600">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Button variant="outline" className="p-3 sm:p-4 h-auto flex-col items-start justify-start space-y-2 hover:bg-indigo-50 border-indigo-200 transition-all duration-200 transform hover:scale-105">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 mb-2" />
              <div className="text-left">
                <p className="font-medium text-indigo-600">Add New Task</p>
                <p className="text-xs sm:text-sm text-gray-600">Create a new todo item</p>
              </div>
            </Button>
            <Button variant="outline" className="p-3 sm:p-4 h-auto flex-col items-start justify-start space-y-2 hover:bg-purple-50 border-purple-200 transition-all duration-200 transform hover:scale-105">
              <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
              <div className="text-left">
                <p className="font-medium text-purple-600">Log Expense</p>
                <p className="text-xs sm:text-sm text-gray-600">Record a new expense</p>
              </div>
            </Button>
            <Button variant="outline" className="p-3 sm:p-4 h-auto flex-col items-start justify-start space-y-2 hover:bg-indigo-50 border-indigo-200 transition-all duration-200 transform hover:scale-105">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 mb-2" />
              <div className="text-left">
                <p className="font-medium text-indigo-600">Chat with AI</p>
                <p className="text-xs sm:text-sm text-gray-600">Ask questions or get help</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;