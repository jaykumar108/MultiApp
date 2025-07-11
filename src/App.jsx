import React, { useState, useEffect } from 'react';
import { Home, CheckSquare, IndianRupee, MessageCircle, User, LogOut } from 'lucide-react';
import TodoApp from './components/TodoApp';
import ExpenseTracker from './components/ExpenseTracker';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('todos');
    localStorage.removeItem('expenses');
    localStorage.removeItem('gemini_api_key');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, component: Dashboard },
    { id: 'todo', label: 'Todo App', icon: CheckSquare, component: TodoApp },
    { id: 'expenses', label: 'Expenses', icon: IndianRupee, component: ExpenseTracker },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, component: ChatBot },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
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
  );
}

export default App;