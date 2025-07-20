import React from 'react';
import { CheckSquare, IndianRupee, MessageCircle, TrendingUp, Users, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const Dashboard = () => {
  const stats = [
    { label: 'Total Tasks', value: '24', icon: CheckSquare, color: 'bg-black' },
    { label: 'Total Expenses', value: '₹1,234', icon: IndianRupee, color: 'bg-black' },
    { label: 'Chat Messages', value: '156', icon: MessageCircle, color: 'bg-black' },
    { label: 'Productivity', value: '87%', icon: TrendingUp, color: 'bg-black' },
  ];

  const features = [
    {
      title: 'Todo Management',
      description: 'Organize your tasks efficiently with our intuitive todo system',
      icon: CheckSquare,
      color: 'bg-black',
    },
    {
      title: 'Expense Tracking',
      description: 'Keep track of your spending and manage your budget effectively',
      icon: IndianRupee,
      color: 'bg-black',
    },
    {
      title: 'AI Chat Assistant',
      description: 'Get help and answers from our intelligent chat bot powered by Google Gemini',
      icon: MessageCircle,
      color: 'bg-black',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-black mr-3" />
          <h2 className="text-2xl sm:text-3xl font-bold text-black">
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
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-black">{stat.value}</p>
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

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 group transform hover:scale-105"
            >
              <CardContent className="p-4 sm:p-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Button variant="outline" className="p-3 sm:p-4 h-auto flex-col items-start justify-start space-y-2 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-black mb-2" />
              <div className="text-left">
                <p className="font-medium text-black">Add New Task</p>
                <p className="text-xs sm:text-sm text-gray-600">Create a new todo item</p>
              </div>
            </Button>
            <Button variant="outline" className="p-3 sm:p-4 h-auto flex-col items-start justify-start space-y-2 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
              <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-black mb-2" />
              <div className="text-left">
                <p className="font-medium text-black">Log Expense</p>
                <p className="text-xs sm:text-sm text-gray-600">Record a new expense</p>
              </div>
            </Button>
            <Button variant="outline" className="p-3 sm:p-4 h-auto flex-col items-start justify-start space-y-2 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-black mb-2" />
              <div className="text-left">
                <p className="font-medium text-black">Chat with AI</p>
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