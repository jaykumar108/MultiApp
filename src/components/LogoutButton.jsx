import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { logout } from '../services/authService';
import toast from 'react-hot-toast';

const LogoutButton = ({ onLogout, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      
      // Show success toast
      toast.success('Logged out successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });
      
      // Call the parent's onLogout callback
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      // Show error toast
      toast.error('Logout failed, but local data cleared', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #FCA5A5',
        },
      });
      
      // Even if logout API fails, clear local data
      if (onLogout) {
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </>
      )}
    </Button>
  );
};

export default LogoutButton; 