import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Sparkles, IndianRupee, CheckCircle, Phone, MapPin, KeyRound } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { registerUser, loginWithPassword, sendOTP, verifyOTP, storeUserData } from '../services/authService';
import toast, { Toaster } from 'react-hot-toast';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpLogin, setIsOtpLogin] = useState(true); // Default to OTP login
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // API calls now handled by authService

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      
      if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
        newErrors.mobile = 'Mobile number must be 10 digits starting with 6-9';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm password is required';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (isLogin && !isOtpLogin && !formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (isLogin && isOtpLogin && !otpSent && !formData.email.trim()) {
      newErrors.email = 'Email is required for OTP login';
    } else if (isLogin && isOtpLogin && !otpSent && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (isLogin && isOtpLogin && otpSent && otp.join('').length !== 6) {
      newErrors.otp = 'Please enter 6-digit OTP';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        if (isLogin && isOtpLogin && !otpSent) {
          // Send OTP
          await handleSendOTP();
          return;
        }
        
        if (isLogin && isOtpLogin && otpSent) {
          // Verify OTP
          await handleVerifyOTP();
          return;
        }
        
        if (!isLogin) {
          // Register user
          await handleRegisterUser();
        } else {
          // Login user
          await handleLoginUser();
        }
      } catch (error) {
        console.error('Auth error:', error);
        
        // Show toast notification for errors (no inline error display)
        toast.error(error.message || 'Something went wrong', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#DC2626',
            border: '1px solid #FCA5A5',
          },
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRegisterUser = async () => {
    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        city: formData.city,
        mobile: formData.mobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      // Registration successful
      console.log('Registration successful:', data);
      
      // Show success toast
      toast.success('Account created successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });
      
      // Call onLogin with user data
      const userData = {
        name: data.user.name,
        email: data.user.email,
        city: data.user.city,
        mobile: formData.mobile,
        userId: data.user.id,
        role: data.user.role,
        joinDate: new Date().toISOString()
      };
      
      // Store user data for persistence
      storeUserData(userData);
      onLogin(userData);
      
    } catch (error) {
      throw error;
    }
  };

  const handleLoginUser = async () => {
    try {
      const data = await loginWithPassword({
        email: formData.email,
        password: formData.password
      });

      // Login successful
      console.log('Login successful:', data);
      
      // Show success toast
      toast.success('Welcome back!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });
      
      // Call onLogin with user data
      const userData = {
        name: data.user.name,
        email: data.user.email,
        city: data.user.city,
        mobile: data.user.mobile,
        userId: data.user.id,
        role: data.user.role,
        joinDate: new Date().toISOString()
      };
      
      // Store user data for persistence
      storeUserData(userData);
      onLogin(userData);
      
    } catch (error) {
      throw error;
    }
  };

  const handleSendOTP = async () => {
    try {
      const data = await sendOTP(formData.email);

      // OTP sent successfully
      console.log('OTP sent successfully:', data);
      setOtpSent(true);
      
      // Show success toast
      toast.success('OTP sent to your email!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });
      
    } catch (error) {
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
      
      if (errors.otp) {
        setErrors(prev => ({ ...prev, otp: '' }));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const resendOtp = async () => {
    try {
      setIsLoading(true);
      await handleSendOTP();
      setOtp(['', '', '', '', '', '']);
      setErrors(prev => ({ ...prev, otp: '' }));
      
      // Show success toast for OTP sent
      toast.success('OTP sent successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      // Show error toast (no inline error display)
      toast.error(error.message || 'Failed to resend OTP', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #FCA5A5',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const otpString = otp.join('');
      const data = await verifyOTP(formData.email, otpString);

      // OTP verification successful
      console.log('OTP verification successful:', data);
      
      // Show success toast
      toast.success('OTP verified successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });
      
      // Call onLogin with user data
      const userData = {
        name: data.user.name,
        email: data.user.email,
        city: data.user.city,
        mobile: data.user.mobile,
        userId: data.user.id,
        role: data.user.role,
        joinDate: new Date().toISOString()
      };
      
      // Store user data for persistence
      storeUserData(userData);
      onLogin(userData);
      
    } catch (error) {
      throw error;
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
    <>
      <Toaster />
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

          {/* Login Method Toggle */}
          {isLogin && (
            <div className="flex items-center justify-center space-x-4 bg-gray-50 p-2 rounded-lg">
              <Button
                variant={isOtpLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setIsOtpLogin(true);
                  setOtpSent(false);
                  setOtp(['', '', '', '', '', '']);
                  setErrors({});
                }}
                className={isOtpLogin ? "bg-black text-white" : "text-gray-600"}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                OTP Login
              </Button>
              <Button
                variant={!isOtpLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setIsOtpLogin(false);
                  setOtpSent(false);
                  setErrors({});
                }}
                className={!isOtpLogin ? "bg-black text-white" : "text-gray-600"}
              >
                <Lock className="w-4 h-4 mr-2" />
                Password Login
              </Button>
            </div>
          )}

          {/* Auth Form */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* General Error Display - Removed to show only toast notifications */}
                {/* Signup Fields */}
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-black">
                        Full Name *
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

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-black">
                        City *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="city"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.city ? 'border-red-500 focus:border-red-500' : ''}`}
                          placeholder="Enter your city"
                        />
                      </div>
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-sm font-medium text-black">
                        Mobile Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="mobile"
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.mobile ? 'border-red-500 focus:border-red-500' : ''}`}
                          placeholder="Enter mobile number (optional)"
                          maxLength="10"
                        />
                      </div>
                      {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                    </div>
                  </>
                )}

                {/* Email Field - Only show for signup or password login */}
                {(!isLogin || (isLogin && !isOtpLogin)) && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-black">
                      Email Address *
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
                )}

                {/* Email Field for OTP Login */}
                {isLogin && isOtpLogin && !otpSent && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-black">
                      Email Address *
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
                        placeholder="Enter email for OTP"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                )}

                {/* OTP Input */}
                {isLogin && isOtpLogin && otpSent && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-black">
                      Enter OTP *
                    </Label>
                    <div className="flex space-x-2 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg font-semibold"
                          maxLength="1"
                        />
                      ))}
                    </div>
                    {errors.otp && <p className="text-sm text-red-500 text-center">{errors.otp}</p>}
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={resendOtp}
                        disabled={isLoading}
                        className="text-sm text-gray-600 hover:text-black"
                      >
                        {isLoading ? 'Sending...' : 'Resend OTP'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Password Fields */}
                {(!isLogin || (isLogin && !isOtpLogin)) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-black">
                        Password *
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

                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-black">
                          Confirm Password *
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                            placeholder="Confirm your password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                      </div>
                    )}
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium bg-black hover:bg-gray-800" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isLogin ? (
                        isOtpLogin && !otpSent ? 'Sending OTP...' : 'Signing In...'
                      ) : (
                        'Creating Account...'
                      )}
                    </>
                  ) : (
                    <>
                      {isLogin ? (
                        isOtpLogin && !otpSent ? (
                          <>
                            <KeyRound className="w-4 h-4 mr-2" />
                            Send OTP
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4 mr-2" />
                            Sign In
                          </>
                        )
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setIsOtpLogin(true);
                      setOtpSent(false);
                      setOtp(['', '', '', '', '', '']);
                      setErrors({});
                      setFormData({ name: '', email: '', city: '', mobile: '', password: '', confirmPassword: '' });
                      setIsLoading(false);
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
    </>
  );
};

export default Auth;