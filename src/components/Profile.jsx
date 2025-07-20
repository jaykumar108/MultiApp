    import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Phone, Calendar, Shield, Edit3, Save, X, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import toast from 'react-hot-toast';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.city || '',
    mobile: user?.mobile || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // Mock profile data - replace with actual API call
  const [userProfile, setUserProfile] = useState({
    name: user?.name || 'Jay Kumar Sharma',
    email: user?.email || 'jaykumar732092@gmail.com',
    city: user?.city || 'Darbhanga',
    mobile: user?.mobile || '8736587634',
    role: user?.role || 'user',
    joinDate: user?.createdAt || '2025-07-20T05:23:34.791Z',
    avatar: null
  });

  useEffect(() => {
    // Update userProfile when user prop changes
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        city: user.city || prev.city,
        mobile: user.mobile || prev.mobile,
        role: user.role || prev.role,
        joinDate: user.createdAt || prev.joinDate
      }));
    }
  }, [user]);

  useEffect(() => {
    // Load user profile data
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/profile');
      // const data = await response.json();
      // setUserProfile(data);
      
      // For now, use mock data
      setProfileData({
        name: userProfile.name,
        email: userProfile.email,
        city: userProfile.city,
        mobile: userProfile.mobile,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!profileData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (profileData.mobile && !/^[6-9]\d{9}$/.test(profileData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits starting with 6-9';
    }
    
    // Password validation only if changing password
    if (profileData.newPassword || profileData.confirmPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      
      if (!profileData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (profileData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      
      if (!profileData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm password is required';
      } else if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify(profileData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        name: profileData.name,
        email: profileData.email,
        city: profileData.city,
        mobile: profileData.mobile
      }));
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original values
    setProfileData({
      name: userProfile.name,
      email: userProfile.email,
      city: userProfile.city,
      mobile: userProfile.mobile,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                {/* Avatar */}
                <div className="relative mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">{userProfile.name}</h3>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span className="capitalize">{userProfile.role}</span>
                  </div>
                </div>

                {/* Join Date */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(userProfile.joinDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      value={isEditing ? profileData.name : userProfile.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={isEditing ? profileData.email : userProfile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="city"
                      name="city"
                      value={isEditing ? profileData.city : userProfile.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`pl-10 ${errors.city ? 'border-red-500' : ''}`}
                      placeholder="Enter your city"
                    />
                  </div>
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-sm font-medium">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={isEditing ? profileData.mobile : userProfile.mobile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`pl-10 ${errors.mobile ? 'border-red-500' : ''}`}
                      placeholder="Enter mobile number"
                      maxLength="10"
                    />
                  </div>
                  {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={handleInputChange}
                      className={errors.currentPassword ? 'border-red-500' : ''}
                      placeholder="Enter current password"
                    />
                    {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={handleInputChange}
                      className={errors.newPassword ? 'border-red-500' : ''}
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={handleInputChange}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Account Type</Label>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium capitalize">{userProfile.role}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{formatDate(userProfile.joinDate)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile; 