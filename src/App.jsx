import React, { useState, useEffect } from 'react';
import { Home, CheckSquare, IndianRupee, MessageCircle, User, LogOut, Settings } from 'lucide-react';
import TodoApp from './components/TodoApp';
import ExpenseTracker from './components/ExpenseTracker';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Auth from './components/Auth';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { validateToken } from './services/authService';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and validate token
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // check if token exists
        const token = localStorage.getItem('authToken');
        console.log('Token found:', !!token);
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        const userData = await validateToken();
        console.log('User data:', userData);
        
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // If validation fails, user will stay logged out
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    // Store complete user info in state for better functionality
    const completeUserData = {
      name: userData.name,
      email: userData.email,
      city: userData.city,
      mobile: userData.mobile,
      role: userData.role,
      userId: userData.userId,
      isAuthenticated: true
    };
    setUser(completeUserData);
    // User details are not stored in localStorage for security
  };

  const handleLogout = () => {
    setUser(null);
    // Only remove auth token, keep other app data
    localStorage.removeItem('authToken');
    localStorage.removeItem('todos');
    localStorage.removeItem('expenses');
    localStorage.removeItem('gemini_api_key');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, component: Dashboard },
    { id: 'todo', label: 'Todo App', icon: CheckSquare, component: TodoApp },
    { id: 'expenses', label: 'Expenses', icon: IndianRupee, component: ExpenseTracker },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, component: ChatBot },
    { id: 'profile', label: 'Profile', icon: Settings, component: Profile },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        {/* Navbar */}
        <Navbar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          handleLogout={handleLogout}
        />
        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-fade-in">
            <ActiveComponent user={user} />
          </div>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;