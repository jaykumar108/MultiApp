import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Sparkles, Phone, MapPin, KeyRound, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { registerUser, loginWithPassword, sendOTP, verifyOTP, storeUserData } from '../services/authService';
import toast, { Toaster } from 'react-hot-toast';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpLogin, setIsOtpLogin] = useState(true);
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
          await handleSendOTP();
          return;
        }

        if (isLogin && isOtpLogin && otpSent) {
          await handleVerifyOTP();
          return;
        }

        if (!isLogin) {
          await handleRegisterUser();
        } else {
          await handleLoginUser();
        }
      } catch (error) {
        console.error('Auth error:', error);
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

      toast.success('Account created successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });

      const userData = {
        name: data.user.name,
        email: data.user.email,
        city: data.user.city,
        mobile: formData.mobile,
        userId: data.user.id,
        role: data.user.role,
        joinDate: new Date().toISOString()
      };

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

      toast.success('Welcome back!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });

      const userData = {
        name: data.user.name,
        email: data.user.email,
        city: data.user.city,
        mobile: data.user.mobile,
        userId: data.user.id,
        role: data.user.role,
        joinDate: new Date().toISOString()
      };

      storeUserData(userData);
      onLogin(userData);
    } catch (error) {
      throw error;
    }
  };

  const handleSendOTP = async () => {
    try {
      const data = await sendOTP(formData.email);
      setOtpSent(true);

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

      toast.success('OTP verified successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });

      const userData = {
        name: data.user.name,
        email: data.user.email,
        city: data.user.city,
        mobile: data.user.mobile,
        userId: data.user.id,
        role: data.user.role,
        joinDate: new Date().toISOString()
      };

      storeUserData(userData);
      onLogin(userData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-indigo-600">Task Manager</h1>
                <p className="text-sm text-gray-600">Productivity Suite</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-indigo-600">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin ? 'Sign in to access your dashboard' : 'Get started with your productivity journey'}
              </p>
            </div>
          </div>

          {/* Login Method Toggle */}
          {isLogin && (
            <div className="flex items-center justify-center space-x-2 bg-white p-1.5 rounded-full shadow-md mb-6">
              <Button
                variant={isOtpLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setIsOtpLogin(true);
                  setOtpSent(false);
                  setOtp(['', '', '', '', '', '']);
                  setErrors({});
                }}
                className={`rounded-full ${isOtpLogin ? "bg-indigo-500 text-white hover:bg-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}
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
                className={`rounded-full ${!isOtpLogin ? "bg-indigo-500 text-white hover:bg-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Password Login
              </Button>
            </div>
          )}

          {/* Auth Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Signup Fields */}
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                        <Input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`pl-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                        <Input
                          id="city"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`pl-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${errors.city ? 'border-red-500' : ''}`}
                          placeholder="Enter your city"
                        />
                      </div>
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                        Mobile Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                        <Input
                          id="mobile"
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className={`pl-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${errors.mobile ? 'border-red-500' : ''}`}
                          placeholder="Enter mobile number (optional)"
                          maxLength="10"
                        />
                      </div>
                      {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                    </div>
                  </>
                )}

                {/* Email Field */}
                {(!isLogin || (isLogin && !isOtpLogin) || (isLogin && isOtpLogin && !otpSent)) && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-11 pr-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder={isLogin && isOtpLogin ? "Enter email for OTP" : "Enter your email"}
                      />
                      {formData.email && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, email: '' }));
                            if (errors.email) {
                              setErrors(prev => ({ ...prev, email: '' }));
                            }
                          }}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-indigo-50"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </Button>
                      )}
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                )}

                {/* OTP Input */}
                {isLogin && isOtpLogin && otpSent && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Enter OTP <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 justify-between">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-14 text-center text-xl font-semibold border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
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
                        className="text-sm text-indigo-600 hover:text-indigo-700"
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
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`pl-11 pr-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : ''}`}
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-indigo-50"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                          Confirm Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`pl-11 pr-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            placeholder="Confirm your password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-indigo-50"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                          </Button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                      </div>
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isLogin ? (isOtpLogin && !otpSent ? 'Sending OTP...' : 'Signing In...') : 'Creating Account...'}
                    </>
                  ) : (
                    <>
                      {isLogin ? (
                        isOtpLogin && !otpSent ? (
                          <>
                            <KeyRound className="w-5 h-5 mr-2" />
                            Send OTP
                          </>
                        ) : (
                          <>
                            <LogIn className="w-5 h-5 mr-2" />
                            Sign In
                          </>
                        )
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2" />
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
                    className="ml-1 p-0 h-auto text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Auth;