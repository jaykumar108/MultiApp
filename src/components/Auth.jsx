import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Sparkles, IndianRupee, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        joinDate: new Date().toISOString()
      };
      onLogin(userData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const features = [
    {
      icon: CheckCircle,
      title: 'Todo Management',
      description: 'Organize tasks efficiently'
    },
    {
      icon: IndianRupee,
      title: 'Expense Tracking',
      description: 'Manage your budget'
    },
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description: 'Get smart help'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-start lg:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-center py-8 lg:py-0">
        {/* Left Side - Auth Form */}
        <div className="space-y-6">
          {/* Logo and Header */}
          <div className="text-center lg:text-left space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">MultiApp</h1>
                <p className="text-sm text-gray-600">Productivity Suite</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin ? 'Sign in to access your dashboard' : 'Get started with your productivity journey'}
              </p>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-black">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-black">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-black">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium" size="lg">
                  {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setFormData({ name: '', email: '', password: '' });
                    }}
                    className="ml-1 p-0 h-auto text-black hover:text-gray-700 font-medium"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Features Preview */}
        <div className="hidden lg:block space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-black">Everything you need in one place</h3>
            <p className="text-gray-600">Manage tasks, track expenses, and get AI assistance all in one powerful app.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-black">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats */}
          <Card className="border-0 shadow-md bg-black text-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">1K+</div>
                  <div className="text-sm text-gray-300">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">5K+</div>
                  <div className="text-sm text-gray-300">Tasks Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">99%</div>
                  <div className="text-sm text-gray-300">Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Features */}
        <div className="lg:hidden space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-black">Key Features</h3>
            <p className="text-gray-600">Everything you need to stay productive</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center p-4 border-0 shadow-sm">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{feature.title}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;