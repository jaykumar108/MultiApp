import React from 'react';
import { CheckSquare, IndianRupee, MessageCircle, TrendingUp, Users, Calendar, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Tasks', value: '24', icon: CheckSquare, color: 'bg-blue-500' },
    { label: 'Total Expenses', value: '₹1,234', icon: IndianRupee, color: 'bg-green-500' },
    { label: 'Chat Messages', value: '156', icon: MessageCircle, color: 'bg-purple-500' },
    { label: 'Productivity', value: '87%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const features = [
    {
      title: 'Todo Management',
      description: 'Organize your tasks efficiently with our intuitive todo system',
      icon: CheckSquare,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Expense Tracking',
      description: 'Keep track of your spending and manage your budget effectively',
      icon: IndianRupee,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'AI Chat Assistant',
      description: 'Get help and answers from our intelligent chat bot powered by Google Gemini',
      icon: MessageCircle,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-blue-500 mr-3" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome to MultiApp
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
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg shadow-lg`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300 group transform hover:scale-105"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-200/50">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button className="p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 text-left transform hover:scale-105">
            <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
            <p className="font-medium text-blue-900">Add New Task</p>
            <p className="text-xs sm:text-sm text-blue-600">Create a new todo item</p>
          </button>
          <button className="p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 text-left transform hover:scale-105">
            <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
            <p className="font-medium text-green-900">Log Expense</p>
            <p className="text-xs sm:text-sm text-green-600">Record a new expense</p>
          </button>
          <button className="p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-200 text-left transform hover:scale-105">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
            <p className="font-medium text-purple-900">Chat with AI</p>
            <p className="text-xs sm:text-sm text-purple-600">Ask questions or get help</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;