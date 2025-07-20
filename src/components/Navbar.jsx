import React from 'react';
import { User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import LogoutButton from './LogoutButton';

const Navbar = ({ tabs, activeTab, setActiveTab, user, handleLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-black">MultiApp</h1>
                <p className="text-xs text-gray-600">Your Productivity Suite</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-black">{user.name}</span>
              </div>
              <LogoutButton onLogout={handleLogout} className="text-gray-600 hover:text-red-600 hover:bg-red-50" />
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className={`w-full justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}


    </>
  );
}

export default Navbar; 